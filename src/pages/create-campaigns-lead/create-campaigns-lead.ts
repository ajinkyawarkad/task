import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateNewCampleadPage } from '../create-new-camplead/create-new-camplead';

@IonicPage()
@Component({
  selector: 'page-create-campaigns-lead',
  templateUrl: 'create-campaigns-lead.html',
})
export class CreateCampaignsLeadPage {

  public array: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.array = navParams.get('array');
    console.log(this.array);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCampaignsLeadPage');
  }

  create()
  {
    this.navCtrl.push(CreateNewCampleadPage);
    
  }
}
