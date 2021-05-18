import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-remaining-lead-deatils',
  templateUrl: 'remaining-lead-deatils.html',
})
export class RemainingLeadDeatilsPage {
  product:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.product = navParams.get("product");
    console.log("product", this.product);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainingLeadDeatilsPage');
  }
  

}
