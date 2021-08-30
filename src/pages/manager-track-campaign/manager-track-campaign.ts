import { Component } from '@angular/core';
 import { AlertController, LoadingController, MenuController } from 'ionic-angular';
import {  NavController, NavParams } from 'ionic-angular';
import { AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import { Counts } from '../../models/user';
import { ToastController } from 'ionic-angular';

import { ManagerLeadDetailsPage } from '../manager-lead-details/manager-lead-details';
import { ManagerEditCampaignPage } from '../manager-edit-campaign/manager-edit-campaign';
import { ManagerPendingLeadsPage } from '../manager-pending-leads/manager-pending-leads';

@Component({
  selector: 'page-manager-track-campaign',
  templateUrl: 'manager-track-campaign.html',
})
export class ManagerTrackCampaignPage {
  counts = {} as Counts;
  descending: boolean = false;
  order: number;
  column: string = "name";

  public anArray: any = [];
  public arr = [];
  public a;
  AllPendings: any = [];
  Segments: string;
  userInfo: any;
  products: any;
  pc = [];
  currentuser =firebase.auth().currentUser

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toast: ToastController
  ) {
    this.Segments = "1";
    //this.menuCtrl.enable(true, 'menu');
  }

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  //=======================================Count===================
  ionViewDidLoad() {
    let currentuser = firebase.auth().currentUser;
    let cu = currentuser.uid;
    let b = [];
    let d = new Date().getDate();
    let m = new Date().getMonth() + 1;
    let y = new Date().getFullYear();
    let fd = y + "-" + m + "-" + d;
    // let a = new Date(fd);
    var d1 = Date.parse(fd);

   
      let count = [];
      let  pending =[];
       firebase
         .firestore()
         .collection("Company")
         .doc(this.currentuser.photoURL)
         .collection("Users")
         .doc(this.currentuser.uid)
         .collection("CampsAsso")
         .get()
         .then((camp) => {
           camp.docs.forEach((campDoc) => {
             let id = campDoc.data().cid;
             firebase
               .firestore()
               .collection("Company")
               .doc(this.currentuser.photoURL)
               .collection("Campaigns")
               .doc(id)
               .collection("leads")
               .get()
               .then((leads) => {
                 leads.docs.forEach((leadsDoc) => {
                   if(leadsDoc.data().pending == true){
                     pending.push(leadsDoc.data().id)
                   }
                   count.push(leadsDoc.data().id);
                 });
               });
               campDoc.ref.set({
                 totalLeads:count.length,
                 pendingLeads:pending.length,
                 
               },{merge:true})
           });
         });
   

    //================================================================
    
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
    });
    loading.present();
    this.userInfo = 
    this.afs
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Users").doc(currentuser.uid).collection("CampsAsso");
      this.products = this.userInfo.valueChanges();
      this.pc = this.products;
     
 
    loading.dismiss();

  }

  //==================

  pendigDetails(id) {
    this.navCtrl.push(ManagerPendingLeadsPage, {
      cid: id,
    });
  }

  gotoActive(product) {
    this.navCtrl.push(ManagerEditCampaignPage, {
      product: product,
    });
  }

  showPopup(value, Sr_id,manager) {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete",
      subTitle: "Do you really want to delete?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
        {
          text: "OK",

          handler: (data) => {
          
            this.deleteItem1(value, Sr_id,manager);
          },
        },
      ],
    });
    alert.present();
  }

  archive(value) {
  
   
    this.afs
    .collection("Company")
    .doc(this.currentuser.photoURL).collection("Users").doc(this.currentuser.uid).collection("CampsAsso").doc(value.cid)
    .update(
      Object.assign({
        active: false,
      })
    )
      .then(() => {
        this.toast
          .create({
            message: value.name + " " + "is Archived",
            duration: 1000,
            position: "top",
          })
          .present();
      })
      .catch((err) => {
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: err,
          buttons: [
            {
              text: "OK",
              handler: (data) => {
                // this.navCtrl.setRoot(ProfilePage);
              },
            },
          ],
        });
      });
  }

  active(value) {
   
    let currentuser = firebase.auth().currentUser;
    this.afs
    .collection("Company")
    .doc(currentuser.photoURL).collection("Users").doc(currentuser.uid).collection("CampsAsso").doc(value.cid)
      .update(
        Object.assign({
          active: true,
        })
      )
      .then(() => {
        this.toast
          .create({
            message: value.name + " " + "is Active now",
            duration: 1000,
            position: "top",
          })
          .present();

      })
      .catch((err) => {
       
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: err,
          buttons: [
            {
              text: "OK",
              handler: (data) => {
                // this.navCtrl.setRoot(ProfilePage);
              },
            },
          ],
        });
      });
  }

  deleteItem1(value, Sr_id,manager) {
    console.log("SR if00" ,Sr_id)
    let currentuser = firebase.auth().currentUser;
  
    this.afs
      .collection("Company")
      .doc(currentuser.photoURL + "/" + "Campaigns" + "/" + value)
      .delete();

    for (var i in Sr_id) {
      this.afs
      .collection("Company")
      .doc(this.currentuser.photoURL + "/" + "Users" + "/" + Sr_id[i] + "/" + "CampsAsso" +"/" + value )
      .delete();
    }

    this.afs
    .collection("Company")
    .doc(this.currentuser.photoURL + "/" + "Users" + "/" + manager + "/" + "CampsAsso" +"/" + value )
    .delete();

  }

  leads(product) {
    this.navCtrl.push(ManagerLeadDetailsPage, {
      product: product,
    });
  }
}
