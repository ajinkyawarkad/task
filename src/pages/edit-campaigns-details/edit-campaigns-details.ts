import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { Slides } from "ionic-angular";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase";
import { Observable } from "rxjs";
import { EditCsvFieldPage } from "../edit-csv-field/edit-csv-field";

interface Camps {
  name: string;
  role: string;
}

@Component({
  selector: "page-edit-campaigns-details",
  templateUrl: "edit-campaigns-details.html",
})
export class EditCampaignsDetailsPage {
  @ViewChild(Slides) slides: Slides;
  slideOpts;
  public form: FormGroup;
  createSuccess = false;
  public productsss: any[];
  public prod: any;
  userInfo: any;
  products: Observable<Camps[]>;
  productss: any;
  pro: any;
  proo: any;
  sts: any = [];
  anArray: any = [];
  anArray2: any = [];
  idArr = [];
  manIdr;
  manNam;
  manChanged ;
  newManId;
  newManName;
  fieldRecord = {

  }

  product: { cid: ""; name: ""; goals: ""; manager: ""; sr: "" };
  value: any;
  public statuss: any;
  currentuser = firebase.auth().currentUser;

  constructor(
    private _FB: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public afs: AngularFirestore
  ) {
    this.value = navParams.get("product");
  }

  ionViewDidLoad() {
    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL)
      .collection("Admin")
      .doc(this.currentuser.uid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        this.productss = doc.data().Managers;
      });
    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL + "/" + "Campaigns" + "/" + this.value.cid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        this.products = doc.data().status;
        this.sts = this.products;
        this.manIdr = doc.data().manId
        this.manNam = doc.data().manager
      });

    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL + "/" + "Campaigns" + "/" + this.value.cid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        this.prod = doc.data().SR_name;

        for (var c in this.prod) {
          this.anArray.push(this.prod[c]);
          this.anArray2.push(this.prod[c]);
        }
      });

      firebase.firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL + "/" + "Campaigns" + "/" + this.value.cid).collection("Fields").doc("records").get().then(recDoc => {
        this.fieldRecord = recDoc.data()
        console.log("fields",this.fieldRecord)


      })

    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL)
      .collection("Admin")
      .doc(this.currentuser.uid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        this.productsss = doc.data().Users;
        for (var i in this.productsss) {
          let n = this.productsss[i].name;
          for (var x in this.anArray) {
            if (this.anArray.includes(n) === false) {
              this.anArray2.push(n);
            }
          }
        }
      });


  }

  chekMan( name){
    console.log("sadsa",name)


    if(name == this.manNam){
      this.manChanged =false
      this.newManId = this.manIdr

      console.log("Manager not changed = false", this.manChanged)
    }else{


      this.manChanged = true
      // this.newManId = manId
      this.newManName = name

      for(var i in this.productss){
        if(name == this.productss[i].name){
          this.newManId =  this.productss[i].id
        }else{
          console.log("elses")
        }
      }

     

      console.log("Manager changed = true", this.manChanged , "new manager id is:- ", this.newManId)

    }
  }

  ionViewDidEnter() {
    //lock manual swipe for main slider
    this.slides.lockSwipeToNext(true);
    this.slides.lockSwipeToPrev(true);
  }
  Add() {
    //this.sts.push({ status: "", action: "" });
    if (this.sts.length < 8) {
      this.sts.push({ status: "", action: "" });
    } else {
      alert("you reached to limit.. ");
    }
  }

  remove(idx) {
    this.sts.splice(idx, 1);
  }

  temp() {
    let campid = this.value.cid;
    this.navCtrl.push(EditCsvFieldPage, { campid });
  }

  slideToSlide() {
    if (this.slides.getActiveIndex() + 1 === this.slides.length()) {
      this.slides.slideTo(0);
    } else {
      this.slides.lockSwipeToNext(false);
      this.slides.slideTo(this.slides.getActiveIndex() + 1);
      this.slides.lockSwipeToNext(true);
    }
  }

  slideToPrev() {
    if (this.slides.getActiveIndex() + 1 == this.slides.length()) {
      this.slides.lockSwipeToPrev(false);
      this.slides.slideTo(this.slides.getActiveIndex() - 1);
      this.slides.lockSwipeToPrev(true);
    }
  }

  update(data) {
    let uiArr = [];
    uiArr = data;
    console.log("uiArr",uiArr)
    //========================== IDS For selected SRs ================

    for (var a in uiArr) {
      let x;
      let xx;
      let xxx;
      //  y = [];
      x = uiArr[a].split(" ")[0];
      xx = uiArr[a].split(" ")[1];
      xxx =x+" "+xx
      firebase
        .firestore()
        .collection("Company")
        .doc(this.currentuser.photoURL)
        .collection("Users")
        .where("name", "==", xxx )
        .get()
        .then((dat) => {
          dat.docs.forEach((snap) => {
            this.idArr.push(snap.data().id);
          });
          console.log("id",this.idArr)
        })
        .then(() => {
          console.log(this.currentuser.uid,this.value.cid)
          firebase
            .firestore()
            .collection("Company")
            .doc(
              this.currentuser.photoURL +
                "/" +
                "Campaigns" +
                "/" +
                this.value.cid
            )
          firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Users")
          .doc(this.currentuser.uid)
          .collection("CampsAsso")
          .doc( this.value.cid)
            .onSnapshot((doc) => {
              var source = doc.metadata.hasPendingWrites ? "Local" : "Server";

              this.pro = doc.data().status[0].status;
              this.proo = doc.data().status[0].action;
            });


            if(this.manChanged){
              firebase
              .firestore()
              .collection("Company")
              .doc(this.currentuser.photoURL)
              .collection("Users")
              .doc(this.manIdr)
              .collection("CampsAsso")
              .doc( this.value.cid).delete().then(res => {
                firebase
                .firestore()
                .collection("Company")
                .doc(this.currentuser.photoURL)
                .collection("Users")
                .doc(this.newManId)
                .collection("CampsAsso").doc(this.value.cid).set({
                  name: this.value.name,
                  goals: this.value.goals,
                  manager: this.newManName,
                  active:true,
                  cid:this.value.cid
                })
                firebase
                .firestore()
                .collection("Company")
                .doc(this.currentuser.photoURL)
                .collection("Users")
                .doc(this.newManId).collection("CampsAsso").doc(this.value.cid).collection("Fields").doc("record").set(
                  this.fieldRecord
                )
              })
            }else{
              firebase
              .firestore()
              .collection("Company")
              .doc(this.currentuser.photoURL)
              .collection("Users")
              .doc(this.manIdr)
              .collection("CampsAsso").doc(this.value.cid).update({
                name: this.value.name,
                goals: this.value.goals,
                manager: this.value.manager,
                active:true,
                cid:this.value.cid
              })

            }

            
     
          firebase
            .firestore()
            .collection("Company")
            .doc(
              this.currentuser.photoURL +
                "/" +
                "Campaigns" +
                "/" +
                this.value.cid
            )
            .update(
              Object.assign({
                name: this.value.name,
                goals: this.value.goals,
                manager: this.value.manager,
                manId:this.newManId,
                SR_name: data,
                SR_id: this.idArr,
                status: this.sts,
              })
            )
            .then(() => {
              let alert = this.alertCtrl.create({
                title: "Sucess",
                subTitle:
                  "Campaign Updated Sucessfully .. Now you can update fields",
                buttons: [
                  {
                    text: "OK",
                    handler: () => {
                      let campid = this.value.cid;
                      this.navCtrl.push(EditCsvFieldPage, { campid });
                    },
                  },
                ],
              });
              alert.present();
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
        });
    }
  }
}
