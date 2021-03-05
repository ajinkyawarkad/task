import { Component } from '@angular/core';
import { MenuController, NavController, ToastController } from 'ionic-angular';
import { CreateCampaignPage } from '../create-campaign/create-campaign';
import { ReportPage } from '../report/report';
import { TrackCampaignPage } from '../track-campaign/track-campaign';
import { UserDetailsPage } from '../user-details/user-details';

import { AngularFireAuth } from 'angularfire2/auth';


import { AuthserviceProvider } from '../../providers/authservice/authservice';
import 'firebase/firestore';


import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn: Boolean;
  public name:any;
  public email:any;

  constructor(private auth:AngularFireAuth, private storage: Storage,private toast: ToastController,public navCtrl: NavController, public menuCtrl:MenuController) {
    this.menuCtrl.enable(true, 'menu');

//     this.storage.get('name').then((data) => {
//       console.log('name', data);
//       this.name=data.name;
//       //this.isLoggedIn = true;
//    });
//    this.storage.get('email').then((data) => {
//     console.log('email', data);
//     this.email=data.email;
//     //this.isLoggedIn = true;
//  });
  }
  

  ionViewWillLoad() 
    {
    
      this.auth.authState.subscribe(data => {
        if(data.email && data.uid){
          console.log(data.email);
            this.toast.create({
          message : "Welcome"+ " " + data.email,
          duration:3000,
          position:'top'
        }).present();
        
      }
      else{
        this.toast.create({
          message : 'Could not Found User',
          duration:3000
        }).present();
      }
      });

    }
  
  report()
  {
    this.navCtrl.push(ReportPage);
  }
  user()
  {
    this.navCtrl.push(UserDetailsPage);
  }
  
  createCampaigns()
  {
    this.navCtrl.push(CreateCampaignPage);
  } 
  trackCampaigns()
  {
    this.navCtrl.push(TrackCampaignPage);
  }


}
