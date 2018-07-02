import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { MindsdkService } from './services/mindsdk.service';
import { AnomalyDetectionComponent } from './components/anomaly-detection/anomaly-detection.component';
import { AssetService } from './services/asset.service';
import { AnomalyService } from './services/anomaly.service';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AnomalyDetectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MindsdkService, CookieService, AssetService, AnomalyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
