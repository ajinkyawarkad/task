import { Component } from '@angular/core';
import { AlertController, MenuController } from 'ionic-angular';
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
  
  public anArray:any=[];
  Segments:string;
  userInfo:any;
  products: Observable<Users[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,
    public menuCtrl:MenuController,public alertCtrl:AlertController) {
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

  showPopup(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      subTitle: 'Do you really want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'OK',
          
          handler: data => {
            console.log(value);
            this.deleteItem1(value);

          }
        }
      ]
    });
    alert.present();
  }
 

  deleteItem1(value)
  {

  let currentuser=firebase.auth().currentUser;
  this.afs.collection('Company').doc("COM#"+currentuser.uid+'/' +'Campaigns' +'/'+value).delete();
    
  }

  gotoAchived()
  {
    this.navCtrl.push(ArchivedCampaignsDetailsPage);
  }
  leads(product)
  {
    this.navCtrl.push(LeadsDetailsPage, {
      product:product
    });
  }

}
