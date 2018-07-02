import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { AnomalyService } from '../../services/anomaly.service';

@Component({
  selector: 'app-anomaly-detection',
  templateUrl: './anomaly-detection.component.html',
  styleUrls: ['./anomaly-detection.component.css']
})
export class AnomalyDetectionComponent implements OnInit {

  constructor(private _assetService:AssetService, private anomalyService:AnomalyService) { }

  ngOnInit() {
  }

  getAssetData() {
    console.log('getting assets from service...');
    this._assetService.getAssetData().subscribe(response => {
      console.log(response);
    });

  }

  trainModel() {
    console.log('Model training...');
    this.anomalyService.trainModel().subscribe(response => {
      console.log(response);
    });
  }

  detectAnomaly(){
    console.log('Hitting detect Anomaly API');
    this.anomalyService.detectAnomaly().subscribe(response => {
      console.log(response);
      console.log("Anomaly detection completed");
    });
  }
  

}
