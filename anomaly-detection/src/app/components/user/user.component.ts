import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { MindsdkService } from '../../services/mindsdk.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private mindsdkservice: MindsdkService) {
    console.log('Initialising component..');
  }

  ngOnInit() {
    console.log('Initialising application..');
  }

  getAllAssets() {
    console.log('getting assets from service...');
    this.mindsdkservice.getAssetList().subscribe(response => {
      console.log(response);
    });

  }

}
