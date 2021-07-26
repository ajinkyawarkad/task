import { Component } from "@angular/core";
import firebase from "firebase";
import {  NavController, NavParams } from "ionic-angular";
import { PendingLeadsPage } from "../pending-leads/pending-leads";


@Component({
  selector: "page-usertrackcamp",
  templateUrl: "usertrackcamp.html",
})
export class UsertrackcampPage {
  currentuser = firebase.auth().currentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
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
            .where("SR_id", "==", this.currentuser.uid)
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

  }
}
