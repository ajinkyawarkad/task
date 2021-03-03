import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';
import { AuthserviceProvider } from '../../providers/authservice/authservice';
import 'firebase/firestore';
import { Storage } from '@ionic/storage';




/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})




export class UserPage {


  constructor(public navCtrl: NavController,  private storage: Storage, public navParams: NavParams) {
   console.log( navParams.get('currentuser'));
  }
  
  ionViewDidLoad() {
    let currentuser=firebase.auth().currentUser;
    console.log(currentuser.uid,
     currentuser.email,
     currentuser.displayName),
     console.log('ionViewDidLoad UserPage');
   }

  getData(){
    this.storage.get('uid').then((val) => {
      console.log('Your age is', val);
    });

    
  }
















   
   
  }

  

 
    


