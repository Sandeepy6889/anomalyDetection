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
      environment.baseUrl + 'api/assetmanagement/v3/assets?page=0&size=1000')
      .pipe(map((response: any) => response.json()));
  }
}
