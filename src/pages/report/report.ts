import { Component, ElementRef, ViewChild } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Chart } from "chart.js";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import firebase from "firebase";
import { options } from "sw-toolbox";

@Component({
  selector: "page-report",
  templateUrl: "report.html",
})
export class ReportPage {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;

  private barChart: Chart;
  // private doughnutChart: Chart;

  public hideMe1: boolean = false;
  public hideMe2: boolean = false;
  userInfo: any;
  products: any;
  productss: any;
  manager: any;
  SR: any;
  pro = [];

  campNames=[]
  activityCount =[]
  totalleads=[]
  sts=[]
  statuss: any = [];
  campId;
  userId;
  campName = [];
  count = 0;
  public labell: any;
  totalLeads = 0;
  pendingLeads = 0;
  currentuser = firebase.auth().currentUser;
  campcid
  Segments: string;

  constructor(
    public navCtrl: NavController,
    public afs: AngularFirestore,
    public navParams: NavParams
  ) {
    this.Segments = "1";
  }

  hide1() {
    this.hideMe1 = !this.hideMe1;
  }

  hide2() {
    this.hideMe2 = !this.hideMe2;
  }

  ionViewDidLoad() {
   
    
    firebase
      .firestore()
      .collection("Company")
      .doc(this.currentuser.photoURL)
      .collection("Campaigns")
      .get()
      .then((camps) => {
        camps.docs.forEach((campDoc) => {
          let p = campDoc.data().pendings;
          this.pendingLeads = this.pendingLeads + parseInt(p);
          campDoc.ref
            .collection("leads")
            .get()
            .then((leads) => {
              let c = leads.size;
              this.totalLeads = this.totalLeads + c;
            
            });
        });
      });

    
  }

  selecteduser(user) {
 
    this.userId = user.id;

    let currentuser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Users")
      .doc(this.userId)
      .collection("CampsAsso")
      .get()
      .then((doc) => {
        doc.docs.forEach((snap) => {
          this.campName.push(snap.data());
        });
      

        this.count = doc.size;
  
        this.chartUser(this.count);
      });
  }
  selectedCamp(data) {
 

    let currentuser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Campaigns")
      .doc(data.cid)
      .collection("leads")
      .get()
      .then((doc) => {
        this.count = doc.size;
     
        this.chartCamp(this.count);
      });
  }

  camp(selectedcamp) {
   
    this.campcid = selectedcamp.cid;

  }
  camp1(value){
 
    switch (value) {

      case "Activity":

        firebase.firestore().collection("Company").doc(this.currentuser.photoURL).collection("Campaigns").doc(this.campcid)
        .get().then(camp => {  
            this.campNames.push(camp.data().name)
            this.activityCount.push(camp.data().totalActivity)
            camp.ref.collection("leads").get().then(leads => {
              this.totalleads.push(leads.size)
            })
        })
        .then(res => {this.showGraph()})
      
        break;

        case "Status":
        firebase.firestore().collection("Company").doc(this.currentuser.photoURL)
        .collection("Campaigns").doc(this.campcid)
        .onSnapshot((doc) => {
          var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          this.sts = doc.data().status;   
       
        })
        this.chartCamp(this.sts)
       
        break;

      case "Tasks":
        firebase
          .firestore()
          .collection("Company")
          .doc(this.currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.campId)
          .get()
          .then((camp) => {
           let totalActivity = camp.data().totalActivity;
          });
        break;
    }
   
    
  }

  showGraph(){

    
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels:this.campNames,
        datasets: [
          {
            label: "Total Activities on Campaigns",
            data: this.activityCount,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }

          

  selectedstatus(data) {
    let totalActivity;
    this.labell = data;
    let currentuser = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Campaigns")
      .doc(this.campId)
      .collection("leads")
      .where("status", "==", data)
      .get()
      .then((doc) => {
        this.count = doc.size;
     

        this.chartStatus(this.count);
      });
  

    switch (data) {
      case "Activity":
        firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.campId)
          .get()
          .then((camp) => {
            totalActivity = camp.data().totalActivity;
          });
        break;
      case "Status":
       
        firebase
        .firestore()
        .collection("Company")
        .doc(currentuser.photoURL)
        .collection("Campaigns")
        .doc(this.campId)
        .collection("leads")
        // .where("status", "==", data)
        .get()
        .then((doc) => {
          this.count = doc.size;
       
  
          this.chartStatus(this.count);
        });
        break;
      case "Tasks":
        firebase
          .firestore()
          .collection("Company")
          .doc(currentuser.photoURL)
          .collection("Campaigns")
          .doc(this.campId)
          .collection("leads")
          // .doc(this.data.uid)
          //.collection("History")
          //.doc("Activity1")
          
        break;
    }
  }

  chartCamp(status) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels:status,
        datasets: [
          {
            label: "Leads",
            data: [10,10],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255,99,132,1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  chartUser(count) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Campaigns"],
        datasets: [
          {
            label: "Campaigns",
            data: [count],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255,99,132,1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  chartStatus(count) {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Status"],
        datasets: [
          {
            label: this.labell,
            data: [count],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255,99,132,1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
  ngOnInit() {
    let currentuser = firebase.auth().currentUser;
    this.userInfo = this.afs
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Campaigns");
    this.products = this.userInfo.valueChanges();

    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Admin")
      .doc(currentuser.uid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
     
        this.manager = doc.data().Managers;
       
      });

    firebase
      .firestore()
      .collection("Company")
      .doc(currentuser.photoURL)
      .collection("Admin")
      .doc(currentuser.uid)
      .onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
     
        this.SR = doc.data().Users;
     
      });

   
  }
}
