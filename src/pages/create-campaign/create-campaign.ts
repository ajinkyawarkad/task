import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Slides } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { CreateLeadProfilePage } from '../create-lead-profile/create-lead-profile';
@IonicPage()
@Component({
  selector: 'page-create-campaign',
  templateUrl: 'create-campaign.html',
})
export class CreateCampaignPage {

  @ViewChild(Slides) slides: Slides;
  slideOpts;
  public form: FormGroup;
  createSuccess = false;
  
  public array: any = [];
  public bills: any = [];

  constructor(private _FB   : FormBuilder,public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController) {
    this.slideOpts = {
      effect: 'flip'
    };
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
   this.bills.push({ id: 5,  idd:66, value: 'Status6'});
   this.bills.push({ id: 6,  idd:77, value: 'Status7'});
   this.bills.push({ id: 7,  idd:88, value: 'Status8'});
   this.bills.push({ id: 8,  idd:99, value: 'Status9'});
   this.bills.push({ id: 9,  idd:89, value: 'Status10'});
   

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCampaignPage');
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
      console.log(val);
   }
  save(){
    this.navCtrl.push(CreateLeadProfilePage);
    }
    ionViewDidEnter() {
      //lock manual swipe for main slider
      this.slides.lockSwipeToNext(true);
      this.slides.lockSwipeToPrev(true);
    }
  
    slideToSlide() {
      if (this.slides.getActiveIndex() + 1 === this.slides.length()) {
        this.slides.slideTo(0);
      } else {
        this.slides.lockSwipeToNext(false);
        this.slides.slideTo(this.slides.getActiveIndex() + 1);
        this.slides.lockSwipeToNext(true);
      }
    }

    slideToPrev()
   { 
      if (this.slides.getActiveIndex() + 1 == this.slides.length()) 
      {
        this.slides.lockSwipeToPrev(false);
        this.slides.slideTo(this.slides.getActiveIndex() - 1);
        this.slides.lockSwipeToPrev(true);
        
      }  
   }

   presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Success',
      message: 'Compaign Created Successfully. Now You Can Add Leads',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: () => {
            console.log('Add clicked');
            this.navCtrl.push(CreateLeadProfilePage);
          }
        }
      ]
    });
    alert.present();
  }

}
