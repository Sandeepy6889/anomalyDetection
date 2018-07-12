import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { AnomalyService } from '../../services/anomaly.service';
import { DatePipe } from '@angular/common';
import {Chart} from 'chart.js';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-anomaly-detection',
  templateUrl: './anomaly-detection.component.html',
  styleUrls: ['./anomaly-detection.component.css']
})
export class AnomalyDetectionComponent implements OnInit {

  public assetData = [];
  public assetStDt = "";
  public assetEndDt = "";
  public anomalyStDt = "";
  public anomalyEndDt = "";
  public name;
  private modelId="";
  public trained_chart;
  public anomaly_chart;
  private trained_voltage_data=[];
  private trained_current_data=[];
  private _time = [];
  


  constructor(private _assetService:AssetService, private anomalyService:AnomalyService) { }

  ngOnInit() {

     this.getAssetName();
    // this.plotGraph('canvas');
    // this.plotGraph('canvas2');    
  }

  getAssetName(){
    this._assetService.getAssetInfo().subscribe(response => {
      this.name = response.name;
      console.log('Asset Details ',response);
    }); 
  }

  getAssetData() {
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(response => {
      this.assetData = response;
      console.log(response);
    }); 
  }

  trainModel() {
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(response => {
      this.assetData = response;
      this.parseJsonData(this.assetData);
      this.plotGraph('canvas',"training");
      this.anomalyService.trainModel(this.assetData).subscribe(response => {
        this.modelId=response.id;
      });
    });
    
  }

  parseJsonData(assetData){
    this.trained_voltage_data = [];
    this.trained_current_data = [];
    this._time = [];
    for (let index = 0; index < assetData.length; index++) {
      this.trained_voltage_data.push(assetData[index].Voltage);
      this.trained_current_data.push(assetData[index].Current);
      this._time.push(assetData[index]._time);
    }
  }
  
  parseJsonDate(date) {
    // 'MM-DD-YYYY hh:mm:ss'
    return moment(date).format();
  }

  plotGraph(divId: string,chartName : string){
   
    let info = {
      type: 'line',
      data: {
        labels: this._time,
        datasets: [
          { 
            label: 'Voltage',
            data: this.trained_voltage_data,
            borderWidth: 2,
            pointRadius: 2,
            borderColor: "#3cba9f",
            fill: false
          },
          { 
            label: 'Current',
            data: this.trained_current_data,
            borderWidth: 2,
            pointRadius: 2,
            borderColor: "#ffcc00",
            fill: false
          },
        ]
      },
      options: {
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
    if(chartName === "training")
    {
      if(this.trained_chart)
        this.trained_chart.destroy();
        this.trained_chart = new Chart(divId, info);
    }
    else
    {
      if(this.anomaly_chart)
      this.anomaly_chart.destroy();
      this.anomaly_chart = new Chart(divId, info);
    }
  }

  detectAnomaly(){
   this._assetService.getAssetData(this.dateFormat(this.anomalyStDt), this.dateFormat(this.anomalyEndDt)).subscribe(response => {
      this.assetData = response;
      console.log("Data for Anomaly",this.assetData);
      this.parseJsonData(this.assetData);
      this.plotGraph('canvas2',"anamoly");
      this.anomalyService.detectAnomaly(this.assetData,this.modelId).subscribe(response => {
        console.log(response);
        console.log("Anomaly detection completed");
      });
    });
  }

  dateFormat(date){
    var datePipe = new DatePipe("en_US");
    var strDate = datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss.SSS')+"Z"
    console.log('Asset Date', strDate);
    return strDate;
  }
}
