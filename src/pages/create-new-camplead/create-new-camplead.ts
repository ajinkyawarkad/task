import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-create-new-camplead',
  templateUrl: 'create-new-camplead.html',
})
export class CreateNewCampleadPage {
  hideMe=false;
  public form: FormGroup;
  
  public array: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private _FB   : FormBuilder) {

   this.array = navParams.get('array');
   console.log(this.array);
    this.form = this._FB.group({
      name       	  : ['', Validators.required],
      technologies     : this._FB.array([
        this.initTechnologyFields()
      ])
   });
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNewCampleadPage');
  }
  hide() {
    this.hideMe = true;
  }
  initTechnologyFields() : FormGroup
{
   return this._FB.group({  
      name : ['', Validators.required]
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
