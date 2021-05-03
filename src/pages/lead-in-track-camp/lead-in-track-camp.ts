import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs';
import { Lead } from '../../models/user';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';
import { updateIdentifier } from 'typescript';


interface Camps {
  name:string;
    
}

@Component({
  selector: 'page-lead-in-track-camp',
  templateUrl: 'lead-in-track-camp.html',
})
export class LeadInTrackCampPage {

  public anArray:any=[]; 
  public det:any=[];
  public hed:any=[];
  value:any;
  products: Observable<Camps[]>;
  productss: Observable<Camps[]>;
  lead = {} as Lead;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController,
    private storage: Storage) {
    this.value = navParams.get('product');
    console.log(this.value.cid);
  }

  ionViewDidLoad() {
    let currentuser=firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.value.cid).onSnapshot((doc) => {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: "); 
      this.products =  doc.data().CSVfield ; 
      console.log(this.products) ;
      this.anArray=this.products 
  });

  firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid)
.onSnapshot((doc) => {
var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
console.log(source, " data: ");
this.productss = doc.data().Users ;
console.log(this.productss) ;
});

    console.log('ionViewDidLoad LeadInTrackCampPage');
  }

  insertLead(data){
  
   // if(camp.name && camp.goals && camp.manager && camp.sr != null){
     this.storage.get('cuid').then((val) => {
       console.log('id is', val);
       let uuid1 = uuid()
       console.log(uuid);
       console.log(data);
     
      firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(this.value.cid)
      .collection('leads').doc(uuid1)
      .set(Object.assign({
 
       leads:this.anArray,
       SR_id:data.id,
       SR_name:data.name+" "+data.last,
       uid:uuid1 
       }  
     ))
    
     let alert = this.alertCtrl.create({
       title: 'Success',
       subTitle: 'added',
       //scope: id,
       buttons: [{text: 'OK',
                 handler: data => {
               //    this.navCtrl.push(CreateLeadProfilePage,
               //     {
               //       item:uuid1
               //       });
                  } 
               }]
             });
     alert.present();
     }).catch((err) => {
       console.log(err); 
       let alert = this.alertCtrl.create({
         //title: 'Error',
         subTitle:  err ,
         buttons: [{text: 'OK',
                   handler: data => {
                   } 
                 }]
               });
       alert.present();
     });
   }

}
