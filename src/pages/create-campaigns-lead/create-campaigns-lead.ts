import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateNewCampleadPage } from '../create-new-camplead/create-new-camplead';
import { Http } from '@angular/http';
import * as papa from 'papaparse';



@IonicPage()
@Component({
  selector: 'page-create-campaigns-lead',
  templateUrl: 'create-campaigns-lead.html',
})
export class CreateCampaignsLeadPage {
  csvData: any[] = [];
  headerRow: any;

  public array: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http,
    ) {
    this.array = navParams.get('array');
    console.log(this.array);

    this.readCsvData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCampaignsLeadPage');
  }

  // open()
  // {
  //   this.filechooser.open()
  //     .then(file => this.filepath.resolveNativePath(file).then(resolvedfilepath =>{
  //       this.fileopener.open(resolvedfilepath,'application/pdf').then(value=>{
  //         alert("It Worked")
  //       }).catch(err =>{
  //         alert(JSON.stringify(err));
  //       });
  //     })
  //     )
     
  // }

  private readCsvData() {
    this.http.get('assets/dummyData.csv')
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.headerRow = parsedData[0];
 
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }
 
  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.csvData
    });

    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 
  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }

  create()
  {
    this.navCtrl.push(CreateNewCampleadPage);
    
  }
}
