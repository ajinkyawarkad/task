import { Component, ElementRef, ViewChild, } from '@angular/core';
import { MenuController, NavController, ToastController } from 'ionic-angular';
import { CreateCampaignPage } from '../create-campaign/create-campaign';
import { Camp, User } from '../../models/user';

import { ReportPage } from '../report/report';
import { TrackCampaignPage } from '../track-campaign/track-campaign';
import { UserDetailsPage } from '../user-details/user-details';

import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { Chart } from "chart.js";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  use = {} as User;
  productss: any = [];

  private lineChart: Chart;
  private barChart: Chart;
  private doughnutChart: Chart;
  campNames=[]
  activityCount =[]
  totalLeads=[]

  
  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;

  isLoggedIn: Boolean;
  public name:string;
  public email:any;
  currentUser = firebase.auth().currentUser;

  constructor(private auth:AngularFireAuth, private storage: Storage,private toast: ToastController,public navCtrl: NavController, public menuCtrl:MenuController) {
    this.menuCtrl.enable(true, 'menu');

    this.storage.get('name').then((name) => {
      this.name=name;
   });

  }
  

  ngOnInit(){

 
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



          
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels:this.campNames,
        datasets: [
          {
            label:"Total Activities on Campaign",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data:[20,20,43,12,4],
            spanGaps: false
          }
        ]
      }
    });


    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
       
        datasets: [
          {
            label: "Total Leads in Campaign",
            data:this.totalLeads,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", ]
          }
        ],
        labels: this.campNames
      }
    });

  }

  ionViewWillLoad() 
    {


      firebase
      .firestore()
      .collection("Company")
      .doc(this.currentUser.photoURL)
      .collection("Users")
      .onSnapshot((snap) => {
        this.productss = [];
        snap.docs.forEach((dat) => {
          this.productss.push(dat.data());
         //this.userIds.push(dat.data().id);
        });
      });

    this.auth.authState.subscribe(data => {
        if(data.email && data.uid){
        
          this.toast.create({
          message : "Welcome"+ " " + data.email,
          duration:3000,
          position:'top'
        }).present();
        
      }
      else{
        this.toast.create({
          message : 'Could not Found User',
          duration:3000
        }).present();
      }
      });

      firebase.firestore().collection("Company").doc(this.currentUser.photoURL).collection("Campaigns").get().then(camp => {
        camp.docs.forEach(campDoc => {
          this.campNames.push(campDoc.data().name)
          this.activityCount.push(campDoc.data().totalActivity)
          campDoc.ref.collection("leads").get().then(leads => {
            this.totalLeads.push(leads.size)
          })

        })
      }).then(res => {this.showGraph()})


    }

    async getMarkers(use:User) {

      let doc = use.email;
      const events = await firebase.firestore().collection('Company').doc(this.currentUser.photoURL).collection('non-active').doc(this.currentUser.email)
      const dat = await events.get();
     
    }

  
  report()
  {
    this.navCtrl.push(ReportPage);
  }
  user()
  {
    this.navCtrl.push(UserDetailsPage);
  }
  
  createCampaigns()
  {
    this.navCtrl.push(CreateCampaignPage);
  } 
  trackCampaigns()
  {
    this.navCtrl.push(TrackCampaignPage);
  }


}
