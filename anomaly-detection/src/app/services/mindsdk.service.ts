import { Injectable, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';


@Injectable()
export class MindsdkService {
  constructor(private http: HttpClient) {}

  getAssetList() {
    console.log('loading assets..');
    console.log('baseUrl: ' + environment.baseUrl);
     return this.http.get(
      environment.baseUrl + '/api/iottimeseries/v3/timeseries/3cc1e87c3d794e3caf5d018f06646fbd/power?from=2018-05-01T06:15:47.745Z&to=2018-06-21T06:15:47.745Z')
      .pipe(map((response: any) => console.log(response)));
  }
  
  trainModel() {
    console.log('Init model training..');
    console.log('baseUrl: ' + environment.baseUrl);
    var ioTTimeSeriesItems = [
      {
        "age": "stringvalue",
        "_time": "2017-10-01T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-02T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-03T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-04T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-05T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-05T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-07T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-08T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-09T12:00:00.001Z"
      },
      {
        "age": "stringvalue",
        "_time": "2017-10-10T12:00:00.001Z"
      }
    ];
     return this.http.post(
      environment.baseUrl + '/api/specs/anomalydetection-v3.yaml/models?epsilon=5&minPointsPerCluster=3', {ioTTimeSeriesItems :ioTTimeSeriesItems })
      .pipe(map((response: any) => console.log(response)));
  }
}
