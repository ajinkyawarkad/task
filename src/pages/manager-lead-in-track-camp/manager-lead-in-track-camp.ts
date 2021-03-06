import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs';
import { Lead } from '../../models/user';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';
import { updateIdentifier } from 'typescript';
import { HomePage } from '../home/home';
import { LeadsDetailsPage } from '../leads-details/leads-details';


interface Camps {
  name:string;
    
}

@Component({
  selector: 'page-manager-lead-in-track-camp',
  templateUrl: 'manager-lead-in-track-camp.html',
})
export class ManagerLeadInTrackCampPage {
  public anArray:any=[]; 
  public anArray2:any=[]; 
  public det:any=[];
  public hed:any=[];
  value:any;
  products: Observable<Camps[]>;
  productss =[];
  lead = {} as Lead;
  currentuser=firebase.auth().currentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController,
    private storage: Storage) {
    this.value = navParams.get('product');
    
  }

  ionViewDidLoad() {
   
    firebase.firestore().collection('Company').doc(this.currentuser.photoURL).collection('Campaigns').doc(this.value.cid).onSnapshot((doc) => {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    
      this.products =  doc.data().CSVfield ; 
    
      let test:any=[];
      test = this.products ;
      for(var a in test){
        if(test[a].indicator !== "None"){
          this.anArray.push(test[a])
        }else{
          this.anArray2.push(test[a])

        }
      }

     
  });

  firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL)
      .collection("Users")
      .where('role' ,'==', 'Sale Representative')
      .get().then((data)=>{
        data.docs.forEach((snap) => {
          this.productss.push(snap.data());
        });
      })
 
  }

  insertLead(data){
  
   // if(camp.name && camp.goals && camp.manager && camp.sr != null){
     this.storage.get('cuid').then((val) => {
          let uuid1 = uuid()
    
      for (var a in this.anArray) {     
      firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(this.value.cid)
      .collection('leads').doc(uuid1)
        .set({
          [this.anArray[a].indicator]:this.anArray[a].action
        },{merge:true})
      }
     
      firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(this.value.cid)
      .collection('leads').doc(uuid1)
        .set(Object.assign({
        leads:this.anArray2,
        SR_id:data.id,
        SR_name:data.name,
        uid:uuid1,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
        }  
     ),{merge:true}) .then(()=>{
      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Lead added Successfully',
        //scope: id,
        buttons: [{text: 'OK',
                  handler: data => {
                  this.navCtrl.push(HomePage);
                   } 
                }
               
               ]
              });
      alert.present();
     })
    
  
     }).catch((err) => {
        let alert = this.alertCtrl.create({
         //title: 'Error',
         subTitle:  'Problem in adding Lead' ,
         buttons: [{text: 'OK',
                   handler: data => {
                   } 
                 }]
               });
       alert.present();
     });
   }


}
