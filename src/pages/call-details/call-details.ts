import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-call-details',
  templateUrl: 'call-details.html',
})
export class CallDetailsPage {
  uid:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.uid = navParams.get('uid');
    console.log("lead id",this.uid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallDetailsPage');
  }

}
