import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { AnomalyService } from '../../services/anomaly.service';
import { DatePipe } from '@angular/common';

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
  modelId="";

  constructor(private _assetService:AssetService, private anomalyService:AnomalyService) { }

  ngOnInit() {
  }

  dateFormat(date){

    console.log("Time Zone", new Date(date).getTimezoneOffset());
    var datePipe = new DatePipe("en_US");
    var strDate = datePipe.transform(date, 'yyyy-MM-ddThh:mm:ss.SSS')+"Z"
    console.log('Asset Date', strDate);
    return strDate;

  
    // 2018-05-01T06:15:47.745Z
  }

  getAssetData() {
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(response => {
      this.assetData = response;
      console.log(response);
    }); 
  }

  trainModel() {
    console.log('Model training...', this.assetData);
    this._assetService.getAssetData(this.dateFormat(this.assetStDt), this.dateFormat(this.assetEndDt)).subscribe(response => {
      this.assetData = response;
      this.anomalyService.trainModel(this.assetData).subscribe(response => {
        console.log(response);
        this.modelId=response.id;
      });
    });
  }

  detectAnomaly(){
    console.log('Hitting detect Anomaly API');

    this._assetService.getAssetData(this.dateFormat(this.anomalyStDt), this.dateFormat(this.anomalyEndDt)).subscribe(response => {
      this.assetData = response;
      console.log("Data for Anomaly",this.assetData);
      this.anomalyService.detectAnomaly(this.assetData,this.modelId).subscribe(response => {
        console.log(response);
        console.log("Anomaly detection completed");
      });
    });
    
    
  }
  

}
