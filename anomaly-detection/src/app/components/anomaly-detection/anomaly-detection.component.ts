import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { AnomalyService } from '../../services/anomaly.service';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';
import * as moment from 'moment';


@Component({
  selector: 'app-anomaly-detection',
  templateUrl: './anomaly-detection.component.html',
  styleUrls: ['./anomaly-detection.component.css']
})
export class AnomalyDetectionComponent implements OnInit {
  public assetStDt = "";
  public assetEndDt = "";
  public anomalyStDt = "";
  public anomalyEndDt = "";
  public name;
  private modelId = "";
  public trained_chart;
  public anomaly_chart;
  private trained_voltage_data = [];
  private trained_current_data = [];
  private _time = [];
  private anomalyTime = [];
  public trainingAlertType = "";
  public trainingMessage = "";
  public anomalyAlertType = "";
  public anomalyMessage = "";
  public minPointsPrCluster;
  public epsilon;
  private voltageBackgroundColor = [];
  private currentBackgroundColor = [];
  private pointRadius = [];
  public trainZoomEnbl = false;
  public detectZoomEnbl = false;

  @ViewChild('trainingCanvas') trainingCanvas: ElementRef;
  public trainingContext: CanvasRenderingContext2D;
  @ViewChild('anomalyCanvas') anomalyCanvas: ElementRef;
  public anomalyContext: CanvasRenderingContext2D;

  constructor(private _assetService: AssetService, private anomalyService: AnomalyService) { }

  ngOnInit() {
     this.setAssetName();
  }

  ngAfterViewInit(): void {
    this.trainingContext = (<HTMLCanvasElement>this.trainingCanvas.nativeElement).getContext('2d');
    this.anomalyContext = (<HTMLCanvasElement>this.anomalyCanvas.nativeElement).getContext('2d');
  }


  setAssetName() {
    this._assetService.getAssetInfo().subscribe(response => {
      this.name = response.name;
    });
  }

  trainModel() {
    this.trainZoomEnbl = false;
    this.clearTrainingMessages();
    this.clearChartAttributes();
    this.plotGraph("training");
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(assetData => {
      console.log("Total asset data", assetData.length);
      if (assetData.length > 0) {
        this.trainZoomEnbl = true;
        this.anomalyService.trainModel(assetData, this.epsilon, this.minPointsPrCluster).subscribe(response => {
          this.modelId = response.id;
          this.trainingMessage = "Model trained successfully";
          this.trainingAlertType = "alert alert-success";
        }, error => {
          this.trainingMessage = "Error occured while training the model. Please try again";
          this.trainingAlertType = "alert alert-danger";
        });
      }
      else {
        this.trainingMessage = "No data available for given duration";
        this.trainingAlertType = "alert alert-danger";
      }
      this.clearChartAttributes();
      for (let index = 0; index < assetData.length; index++) {
        this.trained_voltage_data.push(assetData[index].Voltage);
        this.trained_current_data.push(assetData[index].Current);
        this._time.push(assetData[index]._time);
        this.voltageBackgroundColor.push('#20B2AA');
        this.currentBackgroundColor.push('#78866b');
        this.pointRadius.push(1.5);
      }
      this.plotGraph("training");
    }, error => {
      this.trainingMessage = "Error occured while fetching asset data. Please try again";
      this.trainingAlertType = "alert alert-danger";
    });
  }

  resetTrainingZoom(){
    this.trained_chart.resetZoom();
  }

  resetAnomalyZoom(){
    this.anomaly_chart.resetZoom();
  }

  detectAnomaly() {
    this.clearAnomalyMessages();
    this.clearChartAttributes();
    this.plotGraph("anomaly");
    this.detectZoomEnbl = false;
    this._assetService.getAssetData(this.dateFormat(this.anomalyStDt), this.dateFormat(this.anomalyEndDt)).subscribe(assetData => {
      if (assetData.length > 0) {
        this.detectZoomEnbl = true;
        console.log("Total asset data", assetData.length);
        this.anomalyService.detectAnomaly(assetData, this.modelId).subscribe(anomalyData => {
          console.log("No of anomalies", anomalyData.length);
          let anomalyIndex = 0;
          for (let index = 0; index < assetData.length; index++) {
            this.trained_voltage_data.push(assetData[index].Voltage);
            this.trained_current_data.push(assetData[index].Current);
            this._time.push(assetData[index]._time);
            if (anomalyData.length > anomalyIndex && assetData[index]._time === anomalyData[anomalyIndex]._time) {
              this.voltageBackgroundColor.push("red");
              this.currentBackgroundColor.push("red");
              this.pointRadius.push(4);
              this.anomalyTime.push(anomalyData[anomalyIndex]._time);
              anomalyIndex = anomalyIndex + 1;
            }
            else {
              this.voltageBackgroundColor.push('#20B2AA');
              this.currentBackgroundColor.push('#78866b');
              this.pointRadius.push(1.5);
            }
          }
          this.plotGraph("anomaly");
        }, error => {
          this.anomalyMessage = "Error occured while detecting anomaly in data. Please try again";
          this.anomalyAlertType = "alert alert-danger";
        });
      } else {
        this.anomalyMessage = "No data available for given duration";
        this.anomalyAlertType = "alert alert-danger";
      }
    }, error => {
      this.anomalyMessage = "Error occured while fetching asset data. Please try again";
      this.anomalyAlertType = "alert alert-danger";
    });
  }

  dateFormat(date) {
    var datePipe = new DatePipe("en_US");
    var dt = datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS') + "Z"
    console.log('Asset Date', dt);
    return dt;
  }

  parseJsonDate(date) {
    // 'MM-DD-YYYY hh:mm:ss'
    return moment(date).format();
  }

  plotGraph(chartName: string) {
    var toottipData = this.anomalyTime;
    let info = {
      type: 'line',
      data: {
        labels: this._time,
        datasets: [
          {
            label: 'Voltage',
            backgroundColor: "#20B2AA",
            data: this.trained_voltage_data,
            pointBackgroundColor: this.voltageBackgroundColor,
            borderWidth: 1.5,
            pointRadius: this.pointRadius,
            borderColor: "#20B2AA",
            fill: false
          },
          {
            label: 'Current',
            backgroundColor: "#78866b",
            data: this.trained_current_data,
            pointBackgroundColor: this.currentBackgroundColor,
            borderWidth: 1.5,
            pointRadius: this.pointRadius,
            borderColor: "#78866b",
            fill: false
          },
        ]
      },
      options: {
        tooltips: {
          callbacks: {
            beforeTitle: function (tooltipItems, data) {
              for (let i = 0; i < toottipData.length; i++) {
                if (tooltipItems[0].xLabel.includes(toottipData[i]))
                  return "Anamoly ";
              }
              return "";
            }
          }
        },
        elements: {
          line: {
            tension: 0.01
          }
        },
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date/Time'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Voltage/Current'
            }
          }],
        },
        pan: {
          enabled: true,
          mode: "xy",
          speed: 10,
          threshold: 10
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: "xy",
          limits: {
            max: 10,
            min: 0.5
          }
        }
      }
    };
    if (chartName === "training") {
      if (this.trained_chart)
        this.trained_chart.destroy();
      this.trained_chart = new Chart(this.trainingContext, info);
    }
    else {
      if (this.anomaly_chart)
        this.anomaly_chart.destroy();
      this.anomaly_chart = new Chart(this.anomalyContext, info);
    }
  }

  clearTrainingMessages() {
    this.trainingAlertType = "";
    this.trainingMessage = "";
  }

  clearAnomalyMessages() {
    this.anomalyAlertType = "";
    this.anomalyMessage = "";
  }

  clearChartAttributes() {
    this.trained_voltage_data = [];
    this.trained_current_data = [];
    this._time = [];
    this.voltageBackgroundColor = [];
    this.currentBackgroundColor = [];
    this.pointRadius = [];
    this.anomalyTime = [];
  }
}
