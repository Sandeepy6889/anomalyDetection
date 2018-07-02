import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor(private http: HttpClient,private cookieService: CookieService) { }

  trainModel() {
    console.log('model training called');
    console.log('baseUrl: ' + environment.baseUrl);
    var ioTTimeSeriesItems = [
      {
        "age": "10",
        "_time": "2017-10-01T12:00:00.001Z"
      },
      {
        "age": "11",
        "_time": "2017-10-02T12:00:00.001Z"
      },
      {
        "age": "12",
        "_time": "2017-10-03T12:00:00.001Z"
      },
      {
        "age": "13",
        "_time": "2017-10-04T12:00:00.001Z"
      },
      {
        "age": "14",
        "_time": "2017-10-05T12:00:00.001Z"
      },
      {
        "age": "15",
        "_time": "2017-10-05T12:00:00.001Z"
      },
      {
        "age": "16",
        "_time": "2017-10-07T12:00:00.001Z"
      },
      {
        "age": "17",
        "_time": "2017-10-08T12:00:00.001Z"
      },
      {
        "age": "18",
        "_time": "2017-10-09T12:00:00.001Z"
      },
      {
        "age": "19",
        "_time": "2017-10-10T12:00:00.001Z"
      }
    ];
    console.log('Cookie info', this.cookieService.get('XSRF-TOKEN'));
     return this.http.post(
      environment.baseUrl + '/api/anomalydetection/v3/models?epsilon=5&minPointsPerCluster=3&_csrf='+this.cookieService.get('XSRF-TOKEN'), ioTTimeSeriesItems)
      .pipe(map((response: any) => console.log(response))); 
  }

  detectAnomaly(){
    console.log('detect anomaly called');
    
    var ioTTimeSeriesItems = [
      {
        "age": "70",
        "_time": "2017-10-12T12:00:00.001Z"
      }];
    return this.http.post(
      environment.baseUrl + '/api/anomalydetection/v3/detectanomalies?modelID=ed05c9a4-7435-4c1b-a4dc-b229eed42146&_csrf='+this.cookieService.get('XSRF-TOKEN'), ioTTimeSeriesItems)
      .pipe(map((response: any) => console.log(response))); 
  }

}
