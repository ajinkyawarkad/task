import { Component } from '@angular/core';
import { AlertController, MenuController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ArchivedCampaignsDetailsPage } from '../archived-campaigns-details/archived-campaigns-details';
import { EditCampaignsDetailsPage } from '../edit-campaigns-details/edit-campaigns-details';
import { LeadsDetailsPage } from '../leads-details/leads-details';

import { LoginPage } from '../login/login';
import { AngularFirestore} from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import firebase from 'firebase';
import { Counts } from '../../models/user';


interface Users {
  name: string,  
  manager:string; 
}

@IonicPage()
@Component({
  selector: "page-track-campaign",
  templateUrl: "track-campaign.html",
})
export class TrackCampaignPage {
  counts = {} as Counts;

  public anArray: any = [];
  public arr = [];
  public a;
  Segments: string;
  userInfo: any;
  products: Observable<Users[]>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController
  ) {
    this.Segments = "1";
    //this.menuCtrl.enable(true, 'menu');
  }

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
    .doc("COM#" + cu)
    .collection("Admin")
    .doc(cu)
    .get()
    .then((doc) => {
      this.a = doc.data().function;
    })


    firebase
      .firestore()
      .collection("Company")
      .doc("COM#" + cu)
      .collection("Admin")
      .doc(cu)
      .get()
      .then((doc) => {
        this.a = doc.data().function;
        firebase
          .firestore()
          .collection("Company")
          .doc("COM#" + currentuser.uid)
          .collection("Campaigns")
          .get()
          .then((doc) => {
            doc.docs.forEach((snap) => {
              let call = [];
              let meet =[];
              this.arr.push(snap.data().cid);
              firebase
                .firestore()
                .collection("Company")
                .doc("COM#" + currentuser.uid)
                .collection("Campaigns")
                .doc(snap.data().cid)
                .collection("leads")
                .get()
                .then((data) => {



                  if(this.a){   
                    firebase
                    .firestore()
                    .collection("Company")
                    .doc("COM#" + currentuser.uid)
                    .collection("Campaigns")
                    .doc(snap.data().cid)
                    .collection("leads")
                    .get()
                    .then((docu) => {
                      console.log(docu.docs.length);
                      //
                      data.docs.forEach(snap2 =>{
                         let action = snap2.data().action;
                         let t = Date.parse(snap2.data().datetime);
                         switch (action){
                           case "Callback":
                             if(t<d1){
                               call.push(t);
                            }else{break;}
                             break;
                           case "Schedule Meet"  :
                            if(t<d1){
                              meet.push(t);
                           }else{break;}
                            break;
  
                         }
                      })
                      console.log("Inserte",snap.data().cid,meet,call);

                      firebase
                      .firestore()
                      .collection("Company")
                      .doc("COM#" + currentuser.uid)
                      .collection("Campaigns")
                      .doc(snap.data().cid)
                      .update({
                        pendingCalls: call.length,
                        pendingMeets: meet.length
                      });

                    })
                  }
                 
                  console.log("Size is", snap.data().cid, data.size);
                  firebase
                    .firestore()
                    .collection("Company")
                    .doc("COM#" + currentuser.uid)
                    .collection("Campaigns")
                    .doc(snap.data().cid)
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

    this.userInfo = this.afs
      .collection("Company")
      .doc("COM#" + currentuser.uid)
      .collection("Campaigns");
    this.products = this.userInfo.valueChanges();
    // this.arr=this.products;
   
    console.log("ionViewDidLoad TrackCampaignPage");
  }
  gotoActive(product) {
    this.navCtrl.push(EditCampaignsDetailsPage, {
      product: product,
    });
  }

  showPopup(value) {
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
            console.log(value);
            this.deleteItem1(value);
          },
        },
      ],
    });
    alert.present();
  }

  deleteItem1(value) {
    let currentuser = firebase.auth().currentUser;
    this.afs
      .collection("Company")
      .doc("COM#" + currentuser.uid + "/" + "Campaigns" + "/" + value)
      .delete();
  }

  gotoAchived() {
    this.navCtrl.push(ArchivedCampaignsDetailsPage);
  }
  leads(product) {
    this.navCtrl.push(LeadsDetailsPage, {
      product: product,
    });
  }
}