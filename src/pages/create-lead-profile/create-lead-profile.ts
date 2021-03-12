import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateCampaignsLeadPage } from '../create-campaigns-lead/create-campaigns-lead';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import jQuery from "jquery";
import * as $ from "jquery";
import * as papa from 'papaparse';

@IonicPage()
@Component({
  selector: 'page-create-lead-profile',
  templateUrl: 'create-lead-profile.html',
})
export class CreateLeadProfilePage {

  hideMe=false;
  public form: FormGroup;
  
  public array: any = [];
  public bills: any = [];

  headerRow: any;
  csvContent: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private _FB   : FormBuilder) {
    
    this.form = this._FB.group({
      name       	  : ['', Validators.required],
      technologies     : this._FB.array([
        this.initTechnologyFields()
      ])
   });

   this.bills.push({ id: 0,  idd:11, value: 'Status1'});
   this.bills.push({ id: 1,  idd:22, value: 'Status2'});
   this.bills.push({ id: 2,  idd:33, value: 'Status3'});
   this.bills.push({ id: 3,  idd:44, value: 'Status4'});
   this.bills.push({ id: 4,  idd:55, value: 'Status5'});
  
  //  if(this.bills.push){
  //   console.log(this.array);
  //  }
   console.log(this.array);

 
  }

  ngAfterViewInit(){
    //  $(document).ready(function(){
    //  alert('JQuery is working!!');
    //  });
     $(document).ready(function() {
    var max_fields = 10;
    var wrapper = $(".container1");
    var add_button = $(".add_form_field");

    var x = 1;
    $(add_button).click(function(e) {
        e.preventDefault();
        if (x < max_fields) {
            x++;
            $(wrapper).append(
              '<div><tr><td><input type="text" name="mytext[]"/></td><td><input type="checkbox" /></td><td><input type="checkbox" /></td><td><a href="#" class="delete">Delete</a></td></tr></div>'); //add input box
        } else {
            alert('You Reached the limits')
        }
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })
});
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateLeadProfilePage');
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

   onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;            
    this.csvContent = textFromFileLoaded;    
    console.log(this.csvContent);

    let parsedData = papa.parse(this.csvContent).data;
    let headerRow = parsedData[0];
    console.log(headerRow);
    parsedData.splice(0, 1);
    this.csvContent = parsedData;
  }
  trackByFn(index: any, item: any) {
    return index;
  }
 

  save(){
    this.navCtrl.push(CreateCampaignsLeadPage,
      {array:this.array});
      
  }
  hide() {
    this.hideMe = true;
  }
  initTechnologyFields() : FormGroup
{
   return this._FB.group({  
      myVal : ['', Validators.required]
   });
}

addNewInputField() : void
{
 
   const control = <FormArray>this.form.controls.technologies;
   control.push(this.initTechnologyFields());
}
removeInputField(i : number) : void
{
   const control = <FormArray>this.form.controls.technologies;
   control.removeAt(i);
}
manage(val : any) : void
   {
      console.dir(val);
   }
}
