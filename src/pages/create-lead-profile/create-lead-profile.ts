import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateCampaignsLeadPage } from '../create-campaigns-lead/create-campaigns-lead';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Http } from '@angular/http';

import * as $ from "jquery";
import * as papa from 'papaparse';
import { HomePage } from '../home/home';
import { CreateNewCampleadPage } from '../create-new-camplead/create-new-camplead';
import firebase from 'firebase';
import { Camp } from '../../models/user';
import { v4 as uuid } from 'uuid';

@IonicPage()
@Component({
  selector: 'page-create-lead-profile',
  templateUrl: 'create-lead-profile.html',
})
export class CreateLeadProfilePage {

  public form: FormGroup;
 
   headerRow: any;
   csvContent: any;
   csvData: any;
   value :any;
   public anArray:any=[];
   data:any;
   index:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private _FB   : FormBuilder, private http: Http
  ,private alertCtrl:AlertController,public navParam:NavParams) {
      
  }
 

  Add(){
    this.anArray.push('');
    }

    remove(idx)
    {
      this.anArray.splice(idx, 1);
    }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateLeadProfilePage');
  }

  onFileSelect(input: HTMLInputElement) {
    const files = input.files;
    var content = this.csvContent;
    
   if (files && files.length) {
        const fileToRead = files[0];
       
        // var storageRef = firebase.storage().ref();
        // storageRef.put(files[0].name)

        const fileReader = new FileReader();
        //fileReader.onload = this.onFileLoad;

        fileReader.onload = () => {
          fileReader.result; // This is valid
          //console.log(fileReader.result)
          this.extractData(fileReader.result);
       };
        fileReader.readAsText(fileToRead, "UTF-8");
   }
  }

  extractData(res) {
    let csvData = res;
    let parsedData = papa.parse(csvData).data;
 
    this.headerRow = parsedData[0];
    console.log( this.headerRow);
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }

  upload(){

    console.log(this.anArray);
    this.data=true;
    let ss=this.anArray;

    let Mainheader =this.headerRow.concat(ss);
    console.log(Mainheader); 
    let uuid1 = uuid()
    console.log(uuid);

    let currentUser = firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc(currentUser.photoURL).collection('Campaigns').doc('06028c55-9cad-45b4-8475-0ef40f11ba3c')
    .update({
      field:Mainheader
    }
    )
    
    this.value = this.navParams.get('item');  
    console.log(this.value);
     var adminId= firebase.auth().currentUser.uid;
     var file_data = $('#myfile').prop('files')[0];
 
   firebase.storage().ref("users").child(adminId +"/"+ this.value + "/file.csv").put(file_data);
  
   let alert = this.alertCtrl.create({
    title: 'Sucess',
    subTitle: ' File Uploaded Successfully',
    buttons: [{text: 'OK',
              handler: data => {
               this.navCtrl.setRoot(HomePage);
              } 
            }]
          });
  alert.present();
  } 

  save1(){
   // this.navCtrl.push(CreateCampaignsLeadPage);
   this.navCtrl.push(CreateNewCampleadPage);
  }
 
  
}