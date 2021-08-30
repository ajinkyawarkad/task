import { Component } from '@angular/core';
 import { AlertController, LoadingController, MenuController } from 'ionic-angular';
import {  NavController, NavParams } from 'ionic-angular';

import { AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import { Counts } from '../../models/user';
import { ToastController } from 'ionic-angular';
import { PendingLeadsPage } from '../pending-leads/pending-leads';
import { ManagerLeadDetailsPage } from '../manager-lead-details/manager-lead-details';
import { ManagerEditCampaignPage } from '../manager-edit-campaign/manager-edit-campaign';
import { ManagerPendingLeadsPage } from '../manager-pending-leads/manager-pending-leads';
import { UserLeadDetailsPage } from '../user-lead-details/user-lead-details';


interface Users {
  name: string;
  manager: string;
}

@Component({
  selector: 'page-home-user',
  templateUrl: 'home-user.html',
})
export class HomeUserPage {
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
    this.menuCtrl.enable(true, 'menu');
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

    //==================Total Leads Vs ADMIN=================================
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Users")
      .doc(cu)
      .get()
      .then((doc) => {
        this.a = doc.data().function; //==============Getting FLAG================
      });

    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Users")
      .doc(cu)
      .get()
      .then((doc) => {
        this.a = doc.data().function;
        firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
          .collection("Users").doc(currentuser.uid).collection("CampsAsso")
          .get()
          .then((doc) => {
            doc.docs.forEach((snap) => {
              let call = [];
              let meet = [];
              this.arr.push(snap.data().cid); //All Campaigns IDs

              firebase
                .firestore()
                .collection("Company")
                .doc(currentuser.photoURL)
                .collection("Campaigns")
                .doc(snap.data().cid)
                .collection("leads")
                .get()
                .then((data) => {
                  if (this.a) {
                    firebase
                      .firestore()
                      .collection("Company")
                      .doc(currentuser.photoURL)
                      .collection("Campaigns")
                      .doc(snap.data().cid)
                      .collection("leads")
                      .get()
                      .then((docu) => {
                      
                        data.docs.forEach((snap2) => {
                          let action = snap2.data().action;
                          let t = Date.parse(snap2.data().datetime);
                          switch (
                            action //Switching Action For Specific counts
                          ) {
                            case "Callback":
                              if (t < d1) {
                                call.push(t);
                               
                                firebase
                                .firestore()
                                .collection("Company")
                                .doc(currentuser.photoURL)
                                .collection("Campaigns")
                                .doc(snap.data().cid)
                                .collection("leads").doc(snap2.data().uid).set({
                                  pending:true
                                },{merge:true})
                                // this.AllPendings.push(snap2.data());
                              } else {
                                break;
                              }
                              break;
                            case "Schedule Meet":
                              if (t < d1) {
                                meet.push(t);
                                
                                firebase
                                .firestore()
                                .collection("Company")
                                .doc(currentuser.photoURL)
                                .collection("Campaigns")
                                .doc(snap.data().cid)
                                .collection("leads").doc(snap2.data().uid).set({
                                  pending:true
                                },{merge:true})
                                // this.AllPendings.push(snap2.data());
                              } else {
                                break;
                              }
                              break;

                              case "Send Mail":
                              if (t < d1) {
                                meet.push(t);
                                
                                firebase
                                .firestore()
                                .collection("Company")
                                .doc(currentuser.photoURL)
                                .collection("Campaigns")
                                .doc(snap.data().cid)
                                .collection("leads").doc(snap2.data().uid).set({
                                  pending:true
                                },{merge:true})
                                // this.AllPendings.push(snap2.data());
                              } else {
                                break;
                              }
                              break;
                          }
                        });

                        firebase //===============Writing Counts back to DB================
                          .firestore()
                          .collection("Company")
                          .doc(currentuser.photoURL)
                          .collection("Users").doc(currentuser.uid).collection("CampsAsso")
                          .doc(snap.data().cid) //===================MAin CampId return from docsForEach on camps collection
                          .update({
                            pendingCalls: call.length,
                            pendingMeets: meet.length,
                            pendings: call.length + meet.length,
                          });
                      });
                  }
                 
                  firebase //===============Writing Counts back to DB================
                          .firestore()
                          .collection("Company")
                          .doc(currentuser.photoURL)
                          .collection("Users").doc(currentuser.uid).collection("CampsAsso")
                          .doc(snap.data().cid) //===================MAin CampId return from docsForEach on camps collection
                          .update({
                      totalLeads: data.size,
                    });
                });
            });
          });
      });

    //================================================================
    // let i;
    // let n = this.arr.length;
    // for(i=0;i<n;i++){

    // }
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Loading...",
    });
    loading.present();
    this.userInfo = this.afs
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
  
    let currentuser = firebase.auth().currentUser;
    this.afs
      .collection("Company")
      .doc(currentuser.photoURL).collection("Users").doc(currentuser.uid).collection("CampsAsso").doc(value.cid)
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
    let currentuser = firebase.auth().currentUser;
    this.afs
    .collection("Company")
    .doc(currentuser.photoURL + "/" + "Campaigns" + "/" + value)
    .delete();

  for (var i in Sr_id) { 
      this.afs
    .collection("Company")
    .doc(currentuser.photoURL + "/" + "Users" + "/" + Sr_id[i] + "/" + "CampsAsso" +"/" + value )
    .delete();
  }

  this.afs
  .collection("Company")
  .doc(currentuser.photoURL + "/" + "Users" + "/" + manager + "/" + "CampsAsso" +"/" + value )
  .delete();
   
  }

  leads(product) {
    this.navCtrl.push(UserLeadDetailsPage, {
      product: product,
    });
  }
}

