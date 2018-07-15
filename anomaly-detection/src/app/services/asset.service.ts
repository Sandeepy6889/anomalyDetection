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
      environment.baseUrl + '/api/iottimeseries/v3/timeseries/3cc1e87c3d794e3caf5d018f06646fbd/power?' + queryString)
      .pipe(map((response: any) => response));
  }

  getAssetInfo() {
    return this.http.get(
      environment.baseUrl + '/api/assetmanagement/v3/assets/3cc1e87c3d794e3caf5d018f06646fbd')
      .pipe(map((response: any) => response));
  }
}
