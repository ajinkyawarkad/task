import { Component, ViewChild } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
} from "ionic-angular";
import { Leadd, Leadref } from "../../models/user";

import firebase, { database, firestore } from "firebase/app";
import { Storage } from "@ionic/storage";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

import { uuid } from "uuidv4";
import { Observable } from "rxjs";
import * as $ from "jquery";
import { Slides } from "ionic-angular";
import { BrowserPlatformLocation } from "@angular/platform-browser/src/browser/location/browser_platform_location";

interface Lead {
  status: string;
  action: string;
}
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
  @ViewChild(Slides) slides: Slides;
  slideOpts;
  public hideMe: boolean = false;
  public hideMe1: boolean = false;
  myDate;
  value: any;
  id: any;
  cid: any;
  data: any;
  data1: any;
  allTasksCount;
  arr: any = [];
  leadId;
  tFromDb = [];
  dFromDb = [];
  act;
  select;
  count;
  //refid:any;
  pendings: any = [];
  leadref = {} as Leadref;
  task = {} as Task;
  leadd = {} as Leadd;
  showTasks;
  showSlide = false;
  public products: Observable<Lead[]>;
  currentuser = firebase.auth().currentUser;

  d = new Date().getDate();
  m = new Date().getMonth() + 1;
  y = new Date().getFullYear();

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
  
    this.leadId = this.data.uid;

    this.slideOpts = {
      effect: "flip",
    };

    let currentuser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL + "/" + "Campaigns" + "/" + this.cid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    
        this.products = doc.data().status;
        this.arr = this.products;
      
      });
  }

  ionViewDidLoad() {
    let allTasks = [];
    let t = [];
    let f = [];
    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL)
      .collection("Campaigns")
      .doc(this.cid)
      .collection("leads")
      .doc(this.leadId)
      .get()
      .then((doc) => {
        this.count = doc.data().pendings;
        this.allTasksCount = doc.data().allTasks;
        let taskTemp = [];
        taskTemp = doc.data().taskIds;
     
        for (var i in taskTemp) {
          this.tFromDb.push(taskTemp[i]);
         
        }
      });

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
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.showTasks = true;
          allTasks = doc.data().data;
          for (var i in allTasks) {
            if (allTasks[i].Completed == true) {
              if (allTasks[i].Action !== "None") {
                t.push(allTasks[i].id);
              } 
            } else {
              f.push(allTasks[i]);
            }
          }
          for (var c in f) {
            let is = t.includes(f[c].id);
            switch (is) {
              case true:
                break;
              case false:
                this.pendings.push(f[c]);

                break;
            }
          }
        
        } else {
          this.showTasks = false;
        }
      });
  }
  slideToSlide() {
    if (this.slides.getActiveIndex() + 1 === this.slides.length()) {
      this.slides.slideTo(0);
    } else {
      this.slides.lockSwipeToNext(false);
      this.slides.slideTo(this.slides.getActiveIndex() + 1);
      this.slides.lockSwipeToNext(false);
    }
  }

  slideToPrev() {
    if (this.slides.getActiveIndex() + 1 == this.slides.length()) {
      this.slides.lockSwipeToPrev(false);
      this.slides.slideTo(this.slides.getActiveIndex() - 1);
      this.slides.lockSwipeToPrev(false);
    }
  }

  completeTask(val) {


    if (this.tFromDb.length) {
      let f = this.tFromDb.includes(val.id);
    
      switch (f) {
        case true:
          firebase
            .firestore()
            .collection("Company")
            .doc(this.currentuser.photoURL)
            .collection("Campaigns")
            .doc(this.cid)
            .collection("leads")
            .doc(this.leadId)
            .update({
              allTasks: this.allTasksCount - 1,
              taskIds: firestore.FieldValue.arrayRemove(val.id),
            })
            .then((res) => {
              let fd = this.y + "-" + this.m + "-" + this.d;
              // let a = new Date(fd);
              let d1 = Date.parse(fd);

              let allTasks2 = [];
              let tru = [];
              let fal = [];
              let pends = [];
              let nonPends = [];

              firebase
                .firestore()
                .collection("Company")
                .doc(this.currentuser.photoURL)
                .collection("Campaigns")
                .doc(this.cid)
                .collection("leads")
                .doc(this.leadId)
                .collection("History")
                .doc("Activity1")
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    allTasks2 = doc.data().data;
                    for (var i in allTasks2) {
                      if (allTasks2[i].Completed == true) {
                        if (allTasks2[i].Action !== "None") {
                          tru.push(allTasks2[i].id);
                        } 
                      } else {
                      
                        fal.push(allTasks2[i].id);
                      }
                    }
                    for (var c in fal) {
                      let is = tru.includes(fal[c].id);
                      switch (is) {
                        case true:
                          break;
                        case false:
                          let da = Date.parse(fal[c].FollowUp);
                          if (da <= d1) {
                            pends.push(f[c]);
                          } else {
                            nonPends.push(f[c]);
                          }

                          break;
                      }
                    }
                  
                    let len = pends.length;

                    if (pends.length == 0) {
                    
                      firebase
                        .firestore()
                        .collection("Company")
                        .doc(this.currentuser.photoURL)
                        .collection("Campaigns")
                        .doc(this.cid)
                        .collection("leads")
                        .doc(this.leadId)
                        .update({
                          pending: false,
                        })
                        .then((res) => {
                          let count;
                          firebase
                            .firestore()
                            .collection("Company")
                            .doc(this.currentuser.photoURL)
                            .collection("Campaigns")
                            .doc(this.cid)
                            .get()
                            .then((campDoc) => {
                              count = campDoc.data().pendings;
                              campDoc.ref.update({
                                pendings: count - 1,
                              });
                            });
                        });
                    } else {
                    
                      firebase
                        .firestore()
                        .collection("Company")
                        .doc(this.currentuser.photoURL)
                        .collection("Campaigns")
                        .doc(this.cid)
                        .collection("leads")
                        .doc(this.leadId)
                        .update({
                          pending: true,
                        });
                    }
                  } else {
                    this.showTasks = false;
                  }
                });
            });

          break;
        case false:
          break;
      }
    }

    let currentuser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("Company")
      .doc(
        currentuser.photoURL +
          "/" +
          "Campaigns" +
          "/" +
          this.cid +
          "/" +
          "leads" +
          "/" +
          this.leadId
      )
      .collection("History")
      .doc("Activity1")
      .update({
        data: firestore.FieldValue.arrayUnion({
          Time: new Date(),
          Action: val.Action,
          FollowUp: val.FollowUp,
          Remark: val.Remark,
          Status: val.Status,
          Handler: val.Handler,
          id: val.id,
          Completed: true,
        }),
      });

    var b = new Date().getMonth() + 1;

    var c = new Date().getFullYear();
    var a = new Date().getDate();

    let date = a + "-" + b + "-" + c;
    let dat = "";
    dat = date;
 
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Admin")
      .doc(currentuser.uid)
      .collection("Report")
      .doc(dat)
      .set(
        {
          data: firebase.firestore.FieldValue.arrayUnion({
            Time: new Date(),
            Action: val.Action,
            FollowUp: val.FollowUp,
            Remark: val.Remark,
            name: this.leadId,
            id: val.id,
          }),
        },
        { merge: true }
      );
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
      alert("this will remove this lead profile permently");
    }
  }

  Task(task: Task) {
  
    let s = uuid();
    let u = s.split("-");
    let id = u[0];
    if (task.action && task.remark != null) {
      this.storage.get("cuid").then((val) => {
     
        let uid = uuid();
      
        let currentuser = firebase.auth().currentUser;
        let count ;
        firebase
        .firestore()
        .collection("Company")
        .doc(currentuser.photoURL)
        .collection("Campaigns")
        .doc(this.cid).get().then(camp => {
          count= camp.data().totalActivity
          camp.ref.update({
            totalActivity:count+1
          })

        })

         
        if (task.action == "None") {
          firebase
            .firestore()
            .collection("Company")
            .doc(
              currentuser.photoURL +
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
                  id: uid,
                  action: task.action,
                  datetime: "",
                  status: task.status,
                  remark: task.remark,
                  taskId: id,
                },
                { merge: true }
              )
            );

            firebase
            .firestore()
            .collection("Company")
            .doc(currentuser.photoURL)
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
                  Action: task.action,
                  FollowUp: task.datetime,
                  Remark: task.remark,
                  Status: task.status,
                  Handler: this.data.SR_name,
                  Completed: true,
                  id: id,
                }),
              },
              { merge: true }
            );


        } else {
          firebase
          .firestore()
          .collection("Company")
          .doc(
            currentuser.photoURL +
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
                id: uid,
                action: task.action,
                datetime: task.datetime,
                status: task.status,
                remark: task.remark,
                taskId: id,
              },
              { merge: true }
            )
          );

          firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
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
                Action: task.action,
                FollowUp: task.datetime,
                Remark: task.remark,
                Status: task.status,
                Handler: this.data.SR_name,
                Completed: false,
                id: id,
              }),
            },
            { merge: true }
          );

        }


        firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.cid)
          .collection("leads")
          .doc(this.leadId)
          .get()
          .then((doc) => {
            if ((doc.data().pending = true)) {
              doc.ref.update({
                pending: false,
              });

              firebase
                .firestore()
                .collection("Company")
                .doc(currentuser.photoURL)
                .collection("Campaigns")
                .doc(this.cid)
                .update({
                  pendings: this.count - 1,
                });
            } 
          });

        switch (this.act) {
          case "Inform Manager":
            firebase
              .firestore()
              .collection("Company")
              .doc(
                currentuser.photoURL +
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
                    currentuser.displayName,
                })
              );
            break;
          case "Remove client from profile":
            firebase
              .firestore()
              .collection("Company")
              .doc(
                currentuser.photoURL +
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

       
        var b = new Date().getMonth() + 1;

        var c = new Date().getFullYear();
        var a = new Date().getDate();

        let date = a + "-" + b + "-" + c;
        let dat = "";
        dat = date;
     
        firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
          .collection("Admin")
          .doc(currentuser.uid)
          .collection("Report")
          .doc(dat)
          .set(
            {
              data: firebase.firestore.FieldValue.arrayUnion({
                Time: new Date(),
                Action: task.action,
                FollowUp: task.datetime,
                Remark: task.remark,
                name: this.leadId,
                id: id,
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
          handler: (data) => {

          },
        },
        {
          text: "Save",
          handler: (reff) => {
            if (reff.first_name) {
              
              let currentuser = firebase.auth().currentUser;
              const result =  firebase
          .firestore()
          .collection("Company")
          .doc(
            currentuser.photoURL +
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
  

  hide(action) {
    if (action == "None") {
      this.hideMe = false;
    } else {
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
