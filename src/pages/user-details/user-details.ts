import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { EditTeamDetailsPage } from '../edit-team-details/edit-team-details';
import { UserLicensesPage } from '../user-licenses/user-licenses';

import { UserlistPage } from '../userlist/userlist';
import { AngularFireAuth } from 'angularfire2/auth';
import 'firebase/firestore';
import { Employee, User } from '../../models/user';
import firebase, { database } from 'firebase/app';
import { Storage } from '@ionic/storage';

import { AngularFirestore} from 'angularfire2/firestore';


import { Observable } from 'rxjs';

interface Users {
   first_name: string,  
   last_name:string;
   email:string;
   role:string;
}

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  userInfo:any;
  products: Observable<Users[]>;
  Segments:string;
  
  constructor(public navCtrl: NavController,public afs: AngularFirestore,
    private storage: Storage, public navParams: NavParams,private auth:AngularFireAuth,public alertCtrl: AlertController,) {
    this.Segments="2";

  }

  ionViewWillLoad() 
    { 
      let currentuser=firebase.auth().currentUser;
      this.userInfo = this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('Users'); 
      this.products = this.userInfo.valueChanges();
    }


    deleteItem1(product)
    {
      let currentuser=firebase.auth().currentUser;
      this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('Users').doc('uid')
      .delete()  ; 
      console.log(product);
      currentuser.delete();

    }

    showPopup(uid) {
      let alert = this.alertCtrl.create({
        title: 'Confirm Delete',
        subTitle: 'Do you really want to delete?',
        //scope: id,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            // this.navCtrl.push(StudentListPage);
            }
          },
          {
            text: 'OK',
            
            handler: data => {
              console.log(uid);
             // this.deleteItem1(uid);
               this.navCtrl.push(UserDetailsPage);
             
            }
          }
        ]
      });
      alert.present();
    }
  
  userlicense()
  {
    this.navCtrl.push(UserLicensesPage);
  }
  edit(product)
  {
    this.navCtrl.push(EditTeamDetailsPage, {
      product:product
    });
      
  }

  insertUser(employee:Employee){

    firebase.auth().createUserWithEmailAndPassword(employee.email, "password") 
    .then((data) => {
      let currentuser2=firebase.auth().currentUser;

      this.storage.get('uid').then((val) => {
        console.log('Your age is', val);

        
      firebase.firestore().collection('Company').doc('COM#'+val).collection('Users').doc(currentuser2.uid)
      .set(Object.assign({
        name: employee.name,
        last: employee.last,
        email: employee.email,
        role: employee.role
        } 
      ))  
      });


    firebase.auth().sendPasswordResetEmail(data.email)
    .then((result) => {
      if(result)
      {
        console.log("Check Your Email For Reset Link");
      }
      else{console.log("Failed");}
    });
  })
  
}

}


