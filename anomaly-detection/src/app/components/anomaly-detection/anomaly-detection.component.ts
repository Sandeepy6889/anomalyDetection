import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { AnomalyService } from '../../services/anomaly.service';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';
import { HttpResponse } from '@angular/common/http';
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
  public trainingAlertType = "";
  public trainingMessage = "";
  public anomalyAlertType = "";
  public anomalyMessage = "";
  public minPointsPrCluster;
  public epsilon;
  private voltageBackgroundColor = [];
  private currentBackgroundColor = [];
  private pointRadius = [];

  constructor(private _assetService: AssetService, private anomalyService: AnomalyService) { }

  ngOnInit() {
    // this.setAssetName();
    this.plotGraph('training-canvas', "training");
    this.plotGraph('anomaly-canvas', "anomaly");
  }

  setAssetName() {
    this._assetService.getAssetInfo().subscribe(response => {
      this.name = response.name;
    });
  }

  trainModel() {
    this.clearTrainingMessages();
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(assetData => {
      if (assetData.length > 0) {
        this.anomalyService.trainModel(assetData, this.epsilon, this.minPointsPrCluster).subscribe(response => {
          this.modelId = response.id;
          this.trainingMessage = "Model trained successfully";
          this.trainingAlertType = "alert alert-success";
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
      this.plotGraph('training-canvas', "training");
    });
  }

  detectAnomaly() {
    this.clearAnomalyMessages();
    this._assetService.getAssetData(this.dateFormat(this.anomalyStDt), this.dateFormat(this.anomalyEndDt)).subscribe(assetData => {
      if (assetData.length > 0) {
        this.anomalyService.detectAnomaly(assetData, this.modelId).subscribe(anomalyData => {
          this.clearChartAttributes();
          let anomalyIndex = 0;
          for (let index = 0; index < assetData.length; index++) {
            this.trained_voltage_data.push(assetData[index].Voltage);
            this.trained_current_data.push(assetData[index].Current);
            this._time.push(assetData[index]._time);
             if (anomalyData.length > anomalyIndex && assetData[index]._time === anomalyData[anomalyIndex]._time) {
              this.voltageBackgroundColor.push("red");
              this.currentBackgroundColor.push("red");
              this.pointRadius.push(4);
              console.log('anomalyIndex ', anomalyIndex);
              anomalyIndex = anomalyIndex + 1;       
            }
            else {
              this.voltageBackgroundColor.push('#20B2AA');
              this.currentBackgroundColor.push('#78866b');
              this.pointRadius.push(1.5);
            }
          }
          this.plotGraph('anomaly-canvas', "anomaly");
        });
      } else {
        this.anomalyMessage = "No data available for given duration";
        this.anomalyAlertType = "alert alert-danger";
      }
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

  plotGraph(chartID: string, chartName: string) {
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

      }
    };
    if (chartName === "training") {
      if (this.trained_chart)
        this.trained_chart.destroy();
      this.trained_chart = new Chart(chartID, info);
    }
    else {
      if (this.anomaly_chart)
        this.anomaly_chart.destroy();
      this.anomaly_chart = new Chart(chartID, info);
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
  }

  getData() {
    let jsonData = [
      { Voltage: 100, Current: 1, _time: "2018-05-02T12:00:00Z" },
      { Voltage: 21, Current: 32, _time: "2018-05-02T13:00:00Z" },
      { Voltage: 44, Current: 57, _time: "2018-05-04T15:36:30.816Z" },
      { Voltage: 47, Current: 54, _time: "2018-05-04T15:36:34.688Z" },
      { Voltage: 15, Current: 86, _time: "2018-05-04T15:47:49.660Z" },
      { Voltage: 19, Current: 82, _time: "2018-05-04T15:47:52.537Z" },
      { Voltage: 22, Current: 79, _time: "2018-05-04T15:47:55.257Z" },
      { Voltage: 94, Current: 7, _time: "2018-05-07T17:46:02.542Z" },
      { Voltage: 98, Current: 3, _time: "2018-05-07T17:46:06.461Z" },
      { Voltage: 1, Current: 100, _time: "2018-05-07T17:46:10.546Z" },
      { Voltage: 5, Current: 96, _time: "2018-05-07T17:46:14.493Z" },
      { Voltage: 9, Current: 92, _time: "2018-05-07T17:46:18.313Z" },
      { Voltage: 13, Current: 88, _time: "2018-05-07T17:46:22.392Z" },
      { Voltage: 16, Current: 85, _time: "2018-05-07T17:46:26.250Z" },
      { Voltage: 20, Current: 81, _time: "2018-05-07T17:46:30.138Z" },
      { Voltage: 81, Current: 20, _time: "2018-05-07T17:47:30.464Z" },
      { Voltage: 85, Current: 16, _time: "2018-05-07T17:47:34.339Z" },
      { Voltage: 89, Current: 12, _time: "2018-05-07T17:47:38.188Z" },
      { Voltage: 93, Current: 8, _time: "2018-05-07T17:47:42.156Z" },
      { Voltage: 47, Current: 54, _time: "2018-05-07T17:58:43.493Z" },
      { Voltage: 51, Current: 50, _time: "2018-05-07T17:58:47.235Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T17:59:52.590Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T17:59:56.615Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:00:00.725Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:00:05.655Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:00:10.584Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:00:21.788Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:00:32.338Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:01.711Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:05.519Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:09.354Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:13.390Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:17.340Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:21.586Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:25.574Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:29.402Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:33.447Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:01:37.648Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:08.552Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:12.363Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:16.211Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:20.281Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:24.262Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:28.300Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:32.373Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:36.412Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:40.452Z" },
      { Voltage: 1, Current: 2, _time: "2018-05-07T18:02:44.465Z" },
      { Voltage: 45, Current: 56, _time: "2018-05-07T18:03:44.762Z" },
      { Voltage: 49, Current: 52, _time: "2018-05-07T18:03:48.693Z" },
      { Voltage: 53, Current: 48, _time: "2018-05-07T18:03:52.702Z" },
      { Voltage: 57, Current: 44, _time: "2018-05-07T18:03:56.760Z" },
      { Voltage: 62, Current: 39, _time: "2018-05-07T18:04:00.657Z" },
      { Voltage: 66, Current: 35, _time: "2018-05-07T18:04:04.598Z" },
      { Voltage: 70, Current: 31, _time: "2018-05-07T18:04:08.714Z" },
      { Voltage: 74, Current: 27, _time: "2018-05-07T18:04:12.771Z" },
      { Voltage: 78, Current: 23, _time: "2018-05-07T18:04:16.762Z" },
      { Voltage: 82, Current: 19, _time: "2018-05-07T18:04:20.799Z" },
      { Voltage: 86, Current: 15, _time: "2018-05-07T18:04:24.794Z" },
      { Voltage: 89, Current: 12, _time: "2018-05-07T18:04:28.673Z" },
      { Voltage: 93, Current: 8, _time: "2018-05-07T18:04:32.739Z" },
      { Voltage: 97, Current: 4, _time: "2018-05-07T18:04:36.590Z" },
      { Voltage: 0, Current: 0, _time: "2018-05-07T18:04:40.542Z" },
      { Voltage: 4, Current: 97, _time: "2018-05-07T18:04:44.487Z" },
      { Voltage: 8, Current: 93, _time: "2018-05-07T18:04:48.390Z" },
      { Voltage: 12, Current: 89, _time: "2018-05-07T18:04:52.240Z" },
      { Voltage: 16, Current: 85, _time: "2018-05-07T18:04:56.159Z" }
    ];

    return jsonData;
  }
}
