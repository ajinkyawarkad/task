import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public name:any;
  public value:any;
public email:any;
mainuser:any;
user = {} as User;

  constructor(public auth: AngularFireAuth,public navCtrl: NavController, private storage: Storage,public navParams: NavParams,
    private alertCtrl:AlertController) {
  //   this.storage.get('name').then((data) => {
  //     console.log('name', data);
  //     this.name=data.name;
  //  });

//    this.storage.get('email').then((email) => {  
//     this.email=email;
//  });
//     this.mainuser=firebase.auth().currentUser.uid;
//     console.log(this.mainuser)
  }

  updateprofile(user:User)
  {
    // if(this.mainuser)
    // {
    //   firebase.firestore().collection('Company').doc("COM#"+this.mainuser.uid ).collection('Users').doc(this.mainuser.uid)
    //   .update(Object.assign({
    //     name: user.name,
    //     email: user.email,
    //     phone: user.phone,
    //     company_name:user.company_name,
        
    //     } 
    //   ))
    // }
  }

  logout()
  {
  //   this.storage.remove('name').then((name) =>{
  //     this.name = null;
     this.navCtrl.setRoot(LoginPage);
  //   })
   }
   ResetPassword()
   {
     let alert = this.alertCtrl.create({
       title: 'Reset Password',
       inputs: [{name: 'email', placeholder: 'Email'} ],
       buttons: [{text: 'Cancel',role: 'cancel',
              handler: data => {
              console.log('Cancel clicked');
           }
         },
         {
           text: 'Reset Password',
           handler: data => {
             if (data.email) {
               console.log(data.email);
               const result =this.auth.auth.sendPasswordResetEmail(data.email);
               if(result)
               {
                 console.log("Check Your Email For Reset Link");
                 let alert = this.alertCtrl.create({
                   title: 'Success',
                   subTitle: 'Check Your Email For Reset Link to Change Password',
                   buttons: [{text: 'OK',
                             handler: data => {
                              this.navCtrl.setRoot(ProfilePage);
                             } 
                           }]
                         });
                 alert.present();
               }
               else{
                 console.log("Error  in Sending Reset Link");
                 let alert = this.alertCtrl.create({
                   title: 'Error',
                   subTitle: 'Failed to send reset Link ,please check your Email',
                   buttons: [{text: 'OK',
                             handler: data => {
                              this.navCtrl.setRoot(ProfilePage);
                             } 
                           }]
                         });
                 alert.present();
               }
             } else {
               
               return false;
             }
           }
         }
       ]
     });
     alert.present();
   }


}
