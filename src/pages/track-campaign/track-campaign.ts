import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ArchivedCampaignsDetailsPage } from '../archived-campaigns-details/archived-campaigns-details';
import { EditCampaignsDetailsPage } from '../edit-campaigns-details/edit-campaigns-details';
import { LeadsDetailsPage } from '../leads-details/leads-details';

import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-track-campaign',
  templateUrl: 'track-campaign.html',
})
export class TrackCampaignPage {
  
  Segments:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl:MenuController) {
    this.Segments="1";
    //this.menuCtrl.enable(true, 'menu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackCampaignPage');
  }
  gotoActive()
  {
    this.navCtrl.push(EditCampaignsDetailsPage);
  }

  gotoAchived()
  {
    this.navCtrl.push(ArchivedCampaignsDetailsPage);
  }
  leads()
  {
    this.navCtrl.push(LeadsDetailsPage);
  }

}
