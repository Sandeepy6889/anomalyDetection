import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AnomalyDetectionComponent } from './components/anomaly-detection/anomaly-detection.component';
import { AssetService } from './services/asset.service';
import { AnomalyService } from './services/anomaly.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AnomalyDetectionComponent 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule     
  ],
  providers: [CookieService, AssetService, AnomalyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
