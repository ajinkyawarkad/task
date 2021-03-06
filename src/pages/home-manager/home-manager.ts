import { Component,ElementRef, ViewChild, } from '@angular/core';
import { MenuController,ToastController } from 'ionic-angular';
import {  NavController, NavParams } from 'ionic-angular';
import { ManagerCreateCampaignPage } from '../manager-create-campaign/manager-create-campaign';
import { ManagerTrackCampaignPage } from '../manager-track-campaign/manager-track-campaign';;
import { ManagerReportPage } from '../manager-report/manager-report';
import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
import { Chart } from "chart.js";

@Component({
  selector: 'page-home-manager',
  templateUrl: 'home-manager.html',
})
export class HomeManagerPage {
  isLoggedIn: Boolean;
  public name:string;
  public email:any;
  use = {} as User;
  productss: any = [];

  private lineChart: Chart;
  private barChart: Chart;
  private doughnutChart: Chart;
  currentUser = firebase.auth().currentUser;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;


  constructor(private auth:AngularFireAuth, private storage: Storage,private toast: ToastController,public navCtrl: NavController, public menuCtrl:MenuController) {
    this.menuCtrl.enable(true, 'menu');

    this.storage.get('name').then((name) => {
      this.name=name;
   });

  }

  ngOnInit(){

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
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




      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
       
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
          }
        ],
        labels: ["Interested", "CallBack", "Not Reachable", "Paid User", "Invalid Contacts", "Not Interested"]
      }
    });


     this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
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
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false
          }
        ]
      }
    });
  }



  ionViewDidLoad() {
   
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
  }
  createCampaigns()
  {
    this.navCtrl.push(ManagerCreateCampaignPage)
  }

  trackCampaigns(){
    this.navCtrl.push(ManagerTrackCampaignPage)
  }
  report()
  {
      this.navCtrl.push(ManagerReportPage)
  }
  
}
