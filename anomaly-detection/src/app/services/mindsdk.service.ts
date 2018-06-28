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
}
