import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) { }

  getAssetData(startTime, endTime) {
    let queryString = "from=" + startTime + "&to=" + endTime;
    return this.http.get(
      environment.baseUrl + '/api/iottimeseries/v3/timeseries/2dc4bd68f06b44e5bdc7523734e78651/AnomalyAspect?' + queryString)
      .pipe(map((response: any) => response));
  }

  getAssetInfo() {
    return this.http.get(
      environment.baseUrl + '/api/assetmanagement/v3/assets/2dc4bd68f06b44e5bdc7523734e78651')
      .pipe(map((response: any) => response));
  }
}
