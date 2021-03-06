import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  trainModel(assetData, epsilon, minPointsPrCluster) {
    return this.http.post(
      environment.baseUrl + '/api/anomalydetection/v3/models?epsilon=' + epsilon + '&minPointsPerCluster=' + minPointsPrCluster + '&_csrf=' + this.cookieService.get('XSRF-TOKEN'), assetData)
      .pipe(map((response: any) => { return response; }));
  }

  detectAnomaly(assetData, modelId) {
    return this.http.post(
      environment.baseUrl + '/api/anomalydetection/v3/detectanomalies?modelID=' + modelId + '&_csrf=' + this.cookieService.get('XSRF-TOKEN'), assetData)
      .pipe(map((response: any) => { return response; }));
  }
}
