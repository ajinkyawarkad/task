import { Component, ViewChild } from "@angular/core";
import {AlertController,NavController,NavParams,} from "ionic-angular";
import { Leadd, Leadref } from "../../models/user";
import firebase, { database, firestore } from "firebase/app";
import { Storage } from "@ionic/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { v4 as uuid } from "uuid";
import { Observable } from "rxjs";

interface Task {
  status: string;
  action: string;
  remark: string;
  datetime: string;
}

@Component({
  selector: "page-task-details",
  templateUrl: "task-details.html",
})
export class TaskDetailsPage {

  public hideMe: boolean = false;
  public hideMe1: boolean = false;
  myDate;
  value: any;
  id: any;
  cid: any;
  data: any;
  data1: any;
  arr: any = [];
  act;
  select;
  //refid:any;
  leadref = {} as Leadref;
  task = {} as Task;
  leadd = {} as Leadd;
  showSlide = false;
  count;
  public products: Observable<any[]>;
  currentuser = firebase.auth().currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    private storage: Storage,
    private auth: AngularFireAuth,
    public alertCtrl: AlertController
  ) {
    

    this.cid = navParams.get("cid");
    this.data = navParams.get("data");
   
    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL + "/" + "Campaigns" + "/" + this.cid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        this.products = doc.data().status;
        this.arr = this.products;
      });
  }

  ionViewDidLoad() {
  
    firebase.firestore().collection("Company").doc(this.currentuser.photoURL).collection("Campaigns").doc(this.cid).get().then(doc =>{
      this.count = doc.data().pendings
      
    })
    
    firebase
    .firestore()
    .collection("Company")
    .doc(this.currentuser.photoURL)
    .collection("Campaigns")
    .doc(this.cid)
    .collection("leads")
    .doc(this.data.uid)
    .collection("History")
    .doc("Activity1").get().then(doc =>{
      if(doc.exists){
        console.log("docExists", doc.data().data);      
      }else{
        doc.ref.set({
          taskIds:[]
        })
      }
    })
  }
 

  completeTask(val) {
    // let this.currentuser = firebase.auth().this.currentuser;
    // firebase.firestore().collection('Company').doc(this.currentuser.photoURL).collection('Campaigns').doc(this.cid).collection('leads')
    //   .doc(this.data.uid).collection('History')
    //   .doc('Activity1')
    //   .set({
    //    data:firebase.firestore.FieldValue.arrayUnion({
    //     complete:true
    //    })
    //   },{merge:true}
    //   )
  }

  Getselected(selected_value) { 
    let temp = [];

    this.select = selected_value;
    let action;
    for (var s in this.arr) {
      if (this.arr[s].status == selected_value) {
        temp.push(this.arr[s]);
        action = this.arr[s].action;
      }
    }
    this.act = action;

    if (this.act === "Remove client from profile") {
     
      firebase
      .firestore()
      .collection("Company")
      .doc(
        this.currentuser.photoURL +
          "/" +
          "Campaigns" +
          "/" +
          this.cid +
          "/" +
          "leads" +
          "/" +
          this.data.uid
      )
      .delete().then(res => {
        
        let alert = this.alertCtrl.create({
          title: "Success",
          subTitle: "Deleted",
          //scope: id,
          buttons: [
            {
              text: "OK",
              handler: (data) => {
                this.navCtrl.pop();
              },
            },
          ],
        });
        alert.present();
       
      });
  
    }
  }


  Reference()
  {
    let uid = uuid();
      
    let alert = this.alertCtrl.create({
      title: "Add Reference",
      inputs: [{ name: "first_name", placeholder: "First Name" },
               { name: "last_name", placeholder: "Last Name" },
               { name: "email", placeholder: "Email" },
               { name: "phone", placeholder: "Phone" }],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          
        },
        {
          text: "Save",
          handler: (reff) => {
            if (reff.first_name) {
              
           
              const result =  firebase
          .firestore()
          .collection("Company")
          .doc(
            this.currentuser.photoURL +
              "/" +
              "Campaigns" +
              "/" +
              this.cid +
              "/" +
              "Lead references" +
              "/" +
              uid
          )
          .set(
            Object.assign({
              id: uid,
              first_name: reff.first_name,
              last_name: reff.last_name,
              email: reff.email,
              phone: reff.phone,
              refId: this.data.uid,
            })
          );

              if (result) {
                let alert = this.alertCtrl.create({
                  title: "Success",
                  subTitle: "Reference Added",
                  buttons: [
                    {
                      text: "OK",
                      handler: (data) => {
                        //this.navCtrl.setRoot(HomePage);
                      },
                    },
                  ],
                });
                alert.present();
              }
            } else {
              return false;
            }
          },
        },
      ],
    });
    alert.present();
  }
  
  

  Task(task: Task) {
   
    let taskI = uuid()
    let idArr = taskI.split("-")
    let taskId = idArr[0]
   
    if (task.action && task.remark != null) {
      this.storage.get("cuid").then((val) => {
        let uid = uuid();
      
        firebase
          .firestore()
          .collection("Company")
          .doc(
            this.currentuser.photoURL +
              "/" +
              "Campaigns" +
              "/" +
              this.cid +
              "/" +
              "leads" +
              "/" +
              this.data.uid
          )
          .update(
            Object.assign(
              {
                //id: uid,
                action: task.action,
                datetime: task.datetime,
                status: task.status,
                remark: task.remark,
              }
            )
          );
          firebase
          .firestore()
          .collection("Company")
          .doc(
            this.currentuser.photoURL +
              "/" +
              "Campaigns" +
              "/" +
              this.cid +
              "/" +
              "leads" +
              "/" +
              this.data.uid
          )
          .set(
            
              {
                taskId:taskId
              },{merge:true}
            
          );
    
        firebase.firestore().collection("Company").doc(this.currentuser.photoURL).collection("Campaigns").doc(this.cid).collection("leads").doc(this.data.uid).get().then(doc => {
          if(doc.data().pending = true){
            doc.ref.update({
              pending:false
            })

            firebase.firestore().collection("Company").doc(this.currentuser.photoURL).collection("Campaigns").doc(this.cid).update({
              pendings:this.count-1
            })


          }
        })

        switch (this.act) {
          case "Inform Manager":
            firebase
              .firestore()
              .collection("Company")
              .doc(
                this.currentuser.photoURL +
                  "/" +
                  "Campaigns" +
                  "/" +
                  this.cid +
                  "/" +
                  "leads messages" +
                  "/" +
                  this.data.uid
              )
              .set(
                Object.assign({
                  id: this.data.uid,
                  message:
                    "status upated to " +
                    this.select +
                    " " +
                    "by" +
                    " " +
                    this.currentuser.displayName,
                })
              );
            break;
          case "Remove client from profile":
            firebase
              .firestore()
              .collection("Company")
              .doc(
                this.currentuser.photoURL +
                  "/" +
                  "Campaigns" +
                  "/" +
                  this.cid +
                  "/" +
                  "leads" +
                  "/" +
                  this.data.uid
              )
              .delete();
           
            break;
        }

        firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.cid)
          .collection("leads")
          .doc(this.data.uid)
          .collection("History")
          .doc("Activity1")
          .set(
            {
              [taskId]: {
                Time: new Date(),
                Action: task.action,
                FollowUp: task.datetime,
                Remark: task.remark,
                name: this.data.uid,
                Handler: this.data.SR_name,
                Completed: false,
                taskId:taskId
              },
              taskIds:firestore.FieldValue.arrayUnion(
                taskId
              )
            },
            { merge: true }
          );


        var b = new Date().getMonth() + 1;

        var c = new Date().getFullYear();
        var a = new Date().getDate();

        let date = a + "-" + b + "-" + c;
        let dat = "";
        dat = date;
        

        firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Admin")
          .doc(this.currentuser.uid)
          .collection("Report")
          .doc(dat)
          .set(
            {
              data: firebase.firestore.FieldValue.arrayUnion({
                Time: new Date(),
                Action: task.action,
                FollowUp: task.datetime,
                Remark: task.remark,
                name: this.data.uid,
              }),
            },
            { merge: true }
          );

        let alert = this.alertCtrl.create({
          title: "Success",
          subTitle: "Saved Successfully",
          //scope: id,
          buttons: [
            {
              text: "OK",
              handler: (data) => {
                this.navCtrl.pop();
              },
            },
          ],
        });
        alert.present();
      });
    } else {
      let alert = this.alertCtrl.create({
        title: "Warning",
        subTitle: "Please Insert Data",
        //scope: id,
        buttons: [
          {
            text: "OK",
            handler: (data) => {
              //this.navCtrl.push(LoginPage);
            },
          },
        ],
      });
      alert.present();
    }
  }


  hide(action) {
   
    var b = new Date().getMonth() + 1;

    var c = new Date().getFullYear();
    var a = new Date().getDate();

    let date = a + "-" + b + "-" + c;
    let dat = "";
    dat = date;
   
    if(action == "None"){
      firebase
      .firestore()
      .collection("Company")
      .doc(
        this.currentuser.photoURL +
          "/" +
          "Campaigns" +
          "/" +
          this.cid +
          "/" +
          "leads" +
          "/" +
          this.data.uid
      )
      .update(
        Object.assign(
          {
            //id: uid,
            action: this.task.action,
            datetime: "",
            status:  this.task.status,
            remark: this.task.remark,
           
          },
          { merge: true }
        )
      );
      firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.cid)
          .collection("leads")
          .doc(this.data.uid)
          .collection("History")
          .doc("Activity1")
          .set(
            {
              data: firebase.firestore.FieldValue.arrayUnion({
                Time: new Date(),
                Action:"None",
                FollowUp: "NA",
                Remark: "NA",
                name: this.data.uid,
                Handler: this.data.SR_name,
                Completed: true,
                pending:false
              }),
            },
            { merge: true }

          );
          firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Admin")
          .doc(this.currentuser.uid)
          .collection("Report")
          .doc(dat)
          .set(
            {
              data: firebase.firestore.FieldValue.arrayUnion({
                Time: new Date(),
                Action: "None",
                FollowUp: "",
                Remark: this.task.remark,
                name: this.data.uid,
              }),
            },
            { merge: true }
          );

          let alert = this.alertCtrl.create({
            title: "Success",
            subTitle: "Saved Successfully",
            //scope: id,
            buttons: [
              {
                text: "OK",
                handler: (data) => {
                  this.navCtrl.pop();
                },
              },
            ],
          });
          alert.present();
      
    }else{                //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      this.hideMe = true;
      
    }

  }
  hide1() {
    this.hideMe1 = !this.hideMe1;
  }
  StartTask() {
    this.navCtrl.pop();
  }
  change(datePicker) {
   
    datePicker.open();
  }
  
}
