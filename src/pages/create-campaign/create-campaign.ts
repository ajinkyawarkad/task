import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Slides } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { CreateLeadProfilePage } from '../create-lead-profile/create-lead-profile';
import { Camp } from '../../models/user';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase, { firestore } from 'firebase/app';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';

import { Observable } from 'rxjs';
import * as $ from "jquery";



interface Camps {
  name:string;
  role:string;
  
}

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
  camp = {} as Camp;
  products: Observable<Camps[]>;
  productss: Observable<Camps[]>;
  
  public array: any = [];
  public bills: any = [];
  userInfo:any;

  constructor(private _FB   : FormBuilder,public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,public afs: AngularFirestore,private storage: Storage) {
    this.slideOpts = {
      effect: 'flip'
    };
   

  //  this.bills.push({ id: 0,  idd:11, value: 'Status1'});
  //  this.bills.push({ id: 1,  idd:22, value: 'Status2'});
  //  this.bills.push({ id: 2,  idd:33, value: 'Status3'});
  //  this.bills.push({ id: 3,  idd:44, value: 'Status4'});
  //  this.bills.push({ id: 4,  idd:55, value: 'Status5'});
  //  this.bills.push({ id: 5,  idd:66, value: 'Status6'});
  //  this.bills.push({ id: 6,  idd:77, value: 'Status7'});
  // this.bills.push({ id: 7,  idd:88, value: 'Status8'});
  //  this.bills.push({ id: 8,  idd:99, value: 'Status9'});
  //  this.bills.push({ id: 9,  idd:89, value: 'Status10'});
   

  }
  
  
  ionViewDidLoad() {

    var max_fields = 10;
    var wrapper = $(".container1");
    var add_button = $(".add_form_field");
  //  var HR=this.headerRow ;
    var x = 1;
    $(add_button).click(function(e) {
        e.preventDefault();
      
        if (x < max_fields) {
            x++;
           
            var values = $("input[name='pname[]']")
            .map(function(){return $(this).val();}).get();
            console.log(values);

            

            //let Mainheader =HR.concat(values);
            //console.log(Mainheader);
          
            $(wrapper).append(
              '<div><tr><td><input type="text" name="pname[]" value=""/></td><select  type="text"><option>None</option> <option>Inform Manager</option> <option >Remove client from profile</option</select><td><a href="#" class="delete">Delete</a></td></tr></div>');
               //add input box
              
        } else {
            alert('You Reached the limits')
        }
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })

    console.log('ionViewDidLoad CreateCampaignPage');
    let currentuser=firebase.auth().currentUser;
      firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid).onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: "); 
        this.products =  doc.data().Managers ;
         console.log(this.products) ;
    });

    firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid).onSnapshot((doc) => {
      var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: "); 
      this.productss =  doc.data().Users ;
       console.log(this.productss) ;
  });
  }
  
  

  selectCategory(res)
  {
    console.log(res);
  }

  insertUser(camp:Camp){
    // if(camp.name && camp.goals && camp.manager && camp.sr != null){
      this.storage.get('cuid').then((val) => {
       // console.log('id is', val);
        let uuid1 = uuid()
        console.log(uuid);

      firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(uuid1)
      .set(Object.assign({
        //cid: uuid1,
        name:camp.name,
        goals:camp.goals,
        manager: camp.manager,
        sr: camp.sr
        } 
      ))
     
      let alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'added',
        //scope: id,
        buttons: [{text: 'OK',
                  handler: data => {
                   this.navCtrl.push(CreateLeadProfilePage,
                    {
                      item:uuid1
                      });
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

   // }
  //   else{

  //   let alert = this.alertCtrl.create({
  //     title: 'Error',
  //     subTitle: 'Failed to add',
  //     //scope: id,
  //     buttons: [{text: 'OK',
  //               handler: data => {
  //                 //this.navCtrl.push(crea);
  //               } 
  //             }]
  //           });
  //   alert.present();
  // }
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
