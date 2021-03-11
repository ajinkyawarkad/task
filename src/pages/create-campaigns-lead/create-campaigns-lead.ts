import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateNewCampleadPage } from '../create-new-camplead/create-new-camplead';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";
import { HttpHeaders } from '@angular/common/http';
import { CSVRecord } from '../../models/CSVModel'; 

//declare var testvar;


@IonicPage()
@Component({
  selector: 'page-create-campaigns-lead',
  templateUrl: 'create-campaigns-lead.html',
})
export class CreateCampaignsLeadPage {
 
   
  //csvData: any[] = [];
  headerRow: any;

 
  public array: any = [];

  csvContent: any[] = [];
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    
    this.array = navParams.get('array');
    console.log(this.array);

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCampaignsLeadPage');
  }
  onFileSelect(input: HTMLInputElement) {
    const files = input.files;
    var content = this.csvContent;
   if (files && files.length) {
        const fileToRead = files[0];
        const fileReader = new FileReader();
        fileReader.onload = this.onFileLoad;
        fileReader.readAsText(fileToRead, "UTF-8");
   }
  }

  private onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;              
    this.csvContent = textFromFileLoaded;    
    console.log(this.csvContent);
    //this.extractData(this.csvContent) 
  }


   private extractData(res){
     
    let csvContent = res['_body'] || '';

    let parsedData = papa.parse(csvContent).data;
 
    this.headerRow = parsedData[0];
    console.log();
    parsedData.splice(0, 1);
    this.csvContent = parsedData;
  }


 
  create()
  {
    this.navCtrl.push(CreateNewCampleadPage);
    
  }
}
