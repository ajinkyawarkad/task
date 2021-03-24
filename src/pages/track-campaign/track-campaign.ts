import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ArchivedCampaignsDetailsPage } from '../archived-campaigns-details/archived-campaigns-details';
import { EditCampaignsDetailsPage } from '../edit-campaigns-details/edit-campaigns-details';
import { LeadsDetailsPage } from '../leads-details/leads-details';

import { LoginPage } from '../login/login';
import { AngularFirestore} from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import firebase from 'firebase';

interface Users {
  name: string,  
  manager:string;
  
}

@IonicPage()
@Component({
  selector: 'page-track-campaign',
  templateUrl: 'track-campaign.html',
})
export class TrackCampaignPage {
  
  Segments:string;
  userInfo:any;
  products: Observable<Users[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,
    public menuCtrl:MenuController) {
    this.Segments="1";
    //this.menuCtrl.enable(true, 'menu');
  }

  ionViewDidLoad() {

    let currentuser=firebase.auth().currentUser;
      this.userInfo = this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('Campaigns'); 
      this.products = this.userInfo.valueChanges();
    console.log('ionViewDidLoad TrackCampaignPage');
  }
  gotoActive(product)
  {
    this.navCtrl.push(EditCampaignsDetailsPage, {
      product:product
    });
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
