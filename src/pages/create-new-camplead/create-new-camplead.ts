import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { Lead } from '../../models/user';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';
import { data } from 'jquery';


interface Camps {
   name:string;
     
 }

@IonicPage()
@Component({
  selector: 'page-create-new-camplead',
  templateUrl: 'create-new-camplead.html',
})
export class CreateNewCampleadPage {
  hideMe=false;
  public form: FormGroup;
  products: Observable<Camps[]>;
 
  lead = {} as Lead;
  public anArray:any=[]; 
  public det:any=[];
  public hed:any=[];
  value:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController,
   private storage: Storage) {


   this.value = this.navParams.get('item');  
   console.log(this.value);
  }

  ionViewDidLoad() {
   let currentuser=firebase.auth().currentUser;
   firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.value).onSnapshot((doc) => {
     var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
     console.log(source, " data: "); 

     this.products =  doc.data().CSVfield ;
     
     console.log(this.products) ;
     this.anArray=this.products

     let i;
     let n = this.anArray.length;
     for(i=0;i<n;i++){
       this.det[i] = this.anArray[i].value;
       console.log('det is ' ,this.det)
     }
     
     
     
 });
    console.log('ionViewDidLoad CreateNewCampleadPage');
  }
  hide() {
    this.hideMe = true;
  }
  
  insertLead(lead:Lead){
    
    let i;
    let n = this.anArray.length;
    for(i=0;i<n;i++){
      this.hed[i] = this.anArray[i].action;
      
    }
    console.log('hed is ' ,this.hed)

   // if(camp.name && camp.goals && camp.manager && camp.sr != null){
     this.storage.get('cuid').then((val) => {
      // console.log('id is', val);
       let uuid1 = uuid()
       console.log(uuid);

      
      console.log(this.det);
      var obj = {'uid':uuid1,};
      for (var i = 0; i < this.hed.length; i++) {
      obj[this.det[i]] = this.hed[i];
      }
      console.log(obj);
     

     
  

      

     firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(this.value)
     .collection('leads').doc(uuid1)
     .set(obj)
    
     let alert = this.alertCtrl.create({
       title: 'Success',
       subTitle: 'added',
       //scope: id,
       buttons: [{text: 'OK',
                 handler: data => {
               //    this.navCtrl.push(CreateLeadProfilePage,
               //     {
               //       item:uuid1
               //       });
                  } 
               }]
             });
     alert.present();
     }).catch((err) => {
       console.log(err); 
       let alert = this.alertCtrl.create({
         //title: 'Error',
         subTitle:  err ,
         buttons: [{text: 'OK',
                   handler: data => {
                   } 
                 }]
               });
       alert.present();
     });
   }
}