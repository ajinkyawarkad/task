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
import { merge } from 'jquery';
import { uuid } from 'uuidv4';

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
employee = {} as Employee;

userInfo:any;
products: Observable<Users[]>;
productss: Observable<Users[]>;
Segments:string;


constructor(public navCtrl: NavController,public afs: AngularFirestore,
private storage: Storage, public navParams: NavParams,private auth:AngularFireAuth,public alertCtrl: AlertController,) {
this.Segments="2";

}

ionViewWillLoad()
{
let currentuser=firebase.auth().currentUser;
this.userInfo = this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('non-active');
this.products = this.userInfo.valueChanges();


this.userInfo = this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('Users');
this.productss = this.userInfo.valueChanges();


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
            this.deleteItem2(value);
          }
        }
      ]
    });
    alert.present();
  }
deleteItem1(value)
{
let currentuser=firebase.auth().currentUser;
this.afs.collection('Company').doc("COM#"+currentuser.uid+'/' +'Users' +'/'+value).delete(); 
}

deleteItem2(value)
{

let currentuser=firebase.auth().currentUser;
this.afs.collection('Company').doc("COM#"+currentuser.uid+'/' +'non-active' +'/'+value).delete();
  
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





async showActive(user:User){
let currentUser = firebase.auth().currentUser;
const events = await firebase.firestore().collection('Company').doc("COM#"+currentUser.uid).collection('Admin').doc(currentUser.uid)
const dat = await events.get();
if(!dat.exists){
console.log('No such document!');

}else{
console.log('Document data:', dat.data());

}


}

dummy(){
this.storage.get('cuid').then((val) => {
//console.log('id is', val);
let currentUser = firebase.auth().currentUser;
firebase.firestore().collection('Company').doc(currentUser.photoURL).collection('Admin').doc(currentUser.uid)
.update({
users :{
[this.employee.name]:{
name:this.employee.name,
role:this.employee.role,
last:this.employee.last,
},
}
}
)
})
}

insertUser(employee:Employee){
if(employee.email && employee.role && employee.name && employee.last != null){

this.storage.get('cuid').then((val) => {
console.log('id is', val);
let uid = uuid();
console.log(uid);
let currentUser = firebase.auth().currentUser

firebase.firestore().collection('Company').doc(val).collection('Users').doc(uid)
.set(Object.assign({
id: uid,
name:employee.name,
last:employee.last,
email: employee.email,
role: employee.role
}
))
if(employee.role == 'Manager'){
firebase.firestore().collection('Company').doc(val).collection('Admin').doc(currentUser.uid).set({
Managers :[ {
id: uid,
name: this.employee.name,
role: this.employee.role,
last: this.employee.last,
}]
},{merge: true})

}
else{
firebase.firestore().collection('Company').doc(val).collection('Admin').doc(currentUser.uid).set({
Users :[ {
id: uid,
name: this.employee.name,
role: this.employee.role,
last: this.employee.last,
}]
},{merge: true})
}
let alert = this.alertCtrl.create({
title: 'Success',
subTitle: 'Invitation sent to '+ employee.email,
//scope: id,
buttons: [{text: 'OK',
handler: data => {
this.navCtrl.push(UserDetailsPage);
}
}]
});
alert.present();

});



}else{

let alert = this.alertCtrl.create({
title: 'Warning',
subTitle: 'Insert Data',
//scope: id,
buttons: [{text: 'OK',
handler: data => {
//this.navCtrl.push(LoginPage);
}
}]
});
alert.present();

}

}




}
