import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateCampaignsLeadPage } from '../create-campaigns-lead/create-campaigns-lead';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateLeadProfilePage');
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
