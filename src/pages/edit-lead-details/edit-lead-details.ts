import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Leadd, Leadref } from '../../models/user';

import firebase, { database } from 'firebase/app';
import { Storage } from '@ionic/storage';

import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { uuid } from 'uuidv4';
import { Observable } from 'rxjs';
import * as $ from "jquery";

interface Lead {
  status:string; 
  action:string;
}

interface Lead {
  status:string; 
  action:string;
}

@Component({
  selector: 'page-edit-lead-details',
  templateUrl: 'edit-lead-details.html',
})
export class EditLeadDetailsPage {
  public hideMe: boolean = false;
  public hideMe1: boolean = false;
  myDate;
  value:any;
  id:any;
  data:any;
  data1:any;
  public anArray:any=[]; 
  public anArray2:any=[]; 
  arr:any=[]
  act;
  select;
  public products: Observable<any[]>;
  public productss: Observable<any[]>;
 
 
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController) {
   
    this.value = navParams.get('cid');
      console.log(this.value.cid);

      this.data = navParams.get('data');
      console.log("Data",this.data);

      
      let currentuser=firebase.auth().currentUser;
      firebase.firestore().collection('Company').doc("COM#"+currentuser.uid+'/' +'Campaigns' +'/'+this.value.cid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: "); 
        this.productss =  doc.data().status ;
        this.arr=this.productss;
         console.log(this.productss) ;
    });

    firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.value.cid).onSnapshot((doc) => {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: "); 
      this.products =  doc.data().CSVfield ; 
      
      console.log("csv ",this.products) ;
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

  }

  Getselected(selected_value) {
    let temp=[];
    console.log("SELECT",selected_value)
    this.select=selected_value
    let action;
      for (var s in this.arr){
        if (this.arr[s].status == selected_value){
          temp.push(this.arr[s])
          action=this.arr[s].action
          
        }
      }
    
      this.act=action
      console.log("TEMO",this.act)
  }
  hide() {
    this.hideMe = !this.hideMe;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditLeadDetailsPage');
  }
  
  // update()
  // {
  // console.log(this.value)
  //   let currentuser=firebase.auth().currentUser;

  //   firebase.firestore().collection('Company').doc("COM#"+currentuser.uid).collection('Campaigns').doc(this.campid)
  //   .collection('leads').doc(this.value.uid)

  //           .update(Object.assign({
  //             leads:this.value.leads,
  //             action:this.value.action,
  //             remark:this.value.remark,
  //             status:this.value.status,
  //             datetime:this.value.datetime1  
  //             } 
  //           )).then(() => {
  //             console.log("updated..");
  //             let alert = this.alertCtrl.create({
  //               title: 'Sucess',
  //               subTitle: 'Updated Sucessfully',
  //               buttons: [{text: 'OK',
  //                         handler: data => {
  //                        // this.navCtrl.setRoot(ProfilePage);
  //                         } 
  //                       }]
  //                     });
  //             alert.present();
  //           }).catch((err) => {
  //             console.log(err);
  //             let alert = this.alertCtrl.create({
  //               title: 'Error',
  //               subTitle: err,
  //               buttons: [{text: 'OK',
  //                         handler: data => {
  //                         // this.navCtrl.setRoot(ProfilePage);
  //                         } 
  //                       }]
  //                     });
  //           });
    
  // }

}