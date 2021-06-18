import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-edit-csv-field',
  templateUrl: 'edit-csv-field.html',
})
export class EditCsvFieldPage {

  products:any;
  campid:any;
  anArray:any=[];
  arr:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController) {

    this.campid = navParams.get("campid");
    
  }
  Add(){
   
    //this.arr.push({'value':'','action':' '}); 
    if (this.arr.length < 5) {
      this.arr.push({ value: "", action: "" });
    } else {
      alert("you reached to limit.. ");
    }

    }


    remove(idx)
    {
      this.arr.splice(idx, 1);
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditCsvFieldPage');
    let currentuser=firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.campid).onSnapshot((doc) => {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: "); 
      this.products =  doc.data().CSVfield ; 
      console.log("csv ",this.products) ;
      this.anArray=this.products 
  });
  }

  savefield()
  {
     //let Mainheader =this.anArray;
 
    //console.log("EDITED/Added",this.arr); 
   
    let currentUser = firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc(currentUser.photoURL).collection('Campaigns').doc(this.campid)
    .collection('leads').get().then(dat =>{
      dat.docs.forEach(snap => 
        {
          for(var z in this.arr){
            firebase.firestore().collection('Company').doc(currentUser.photoURL).collection('Campaigns').doc(this.campid)
            .collection('leads').doc(snap.data().uid).update({
              leads:firebase.firestore.FieldValue.arrayUnion(
                this.arr[z]
              )
            })

          }
  
        })
    })

  for(var x in this.arr){
    firebase.firestore().collection('Company').doc(currentUser.photoURL).collection('Campaigns').doc(this.campid)
    .update({
      CSVfield:firebase.firestore.FieldValue.arrayUnion(
        this.arr[x]
      )
    })

  }

 
    let alert = this.alertCtrl.create({
      title: 'Sucess',
      subTitle: ' Field Updated Successfully .. ',
      buttons: [
        {text: 'OK',
                handler: data => {
                  this.navCtrl.push(HomePage)
                }
                
              },
             
            ]
            });
    alert.present();
    
  }




}