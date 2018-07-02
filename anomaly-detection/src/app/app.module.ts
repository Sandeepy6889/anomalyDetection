import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { MindsdkService } from './services/mindsdk.service';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MindsdkService, CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
