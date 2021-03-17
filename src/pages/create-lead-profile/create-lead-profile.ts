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
  constructor(public navCtrl: NavController, public navParams: NavParams,private _FB   : FormBuilder, private http: Http
    ,private alertCtrl:AlertController,public navParam:NavParams) {
      
  }

  ngAfterViewInit(){
    //  $(document).ready(function(){
    //  alert('JQuery is working!!');
    //  });
    
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

   
     
     
    var max_fields = 10;
    var wrapper = $(".container1");
    var add_button = $(".add_form_field");
    var HR=this.headerRow ;
    var x = 1;
    $(add_button).click(function(e) {
        e.preventDefault();
      
        if (x < max_fields) {
            x++;
           
            var values = $("input[name='pname[]']")
            .map(function(){return $(this).val();}).get();
            //console.log(values);

            let Mainheader =HR.concat(values);
            console.log(Mainheader);
          
            $(wrapper).append(
              '<div><tr><td><input type="text" name="pname[]" value=""/></td><td><input type="checkbox" /></td><td><input type="checkbox" /></td><td><input type="checkbox" /></td><td><a href="#" class="delete">Delete</a></td></tr></div>'); //add input box
              
        } else {
            alert('You Reached the limits')
        }
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })

    
  }

  upload(){
    
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