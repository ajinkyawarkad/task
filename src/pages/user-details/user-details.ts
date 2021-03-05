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


@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {

  employee = {} as Employee;
  user = {} as User;
 
  Segments:string;
  constructor(public navCtrl: NavController,private storage: Storage, public navParams: NavParams,private auth:AngularFireAuth,public alertCtrl: AlertController,) {
    this.Segments="2";
  }

 

  ionViewWillLoad(employee) 
    { 
      this.auth.authState.subscribe(data => {
        if(data.email && data.uid){
          // console.log("userpage",data.email);
          // console.log("userpage",data.uid);
          // //employee.set.adminid=data.uid;
          // console.log("userpage",'COM#'+data.uid);

         
        }
      });

    }
  
  displayuser(){
    this.navCtrl.push(UserlistPage);
  }
  userlicense()
  {
    this.navCtrl.push(UserLicensesPage);
  }
  edit()
  {
    this.navCtrl.push(EditTeamDetailsPage);
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

// firebase.firestore().collection('Company').doc('COM#kRyAQrxdsGSIKpeW1N6ctFrN8kw2').collection('Users').doc('new users ')
//     .set(Object.assign({
//       name: employee.name,
//       last: employee.last,
//       email: employee.email,
//       role: employee.role
//       } 
//     ))    

