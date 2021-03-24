import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore} from 'angularfire2/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs';

interface Camps {
  name:string;
  role:string;
}

@IonicPage()
@Component({
  selector: 'page-edit-campaigns-details',
  templateUrl: 'edit-campaigns-details.html',
})
export class EditCampaignsDetailsPage {

  @ViewChild(Slides) slides: Slides;
  slideOpts;
  public form: FormGroup;
  createSuccess = false;
  value:any;
  userInfo:any;
  products: Observable<Camps[]>;
  product:{name:'',goals:'',manager:'',sr:'',status:''};


  constructor(private _FB   : FormBuilder,public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,public afs: AngularFirestore) {
      this.value = navParams.get('product');
      console.log(this.value);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditCampaignsDetailsPage');
    let currentuser=firebase.auth().currentUser;
      firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc('16222a73-4fec-4e7a-bac3-cdfac0d49afd').onSnapshot((doc) => {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: "); 
        this.products =  doc.data().status ;
         console.log(this.products) ;
    });
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

   update(product){
    let currentuser=firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc("COM#"+currentuser.uid).collection('Campaigns').doc('15742d61-2f49-4411-acaf-247362b5868c')
            .update(Object.assign({
              name: this.value.name,
              goals: this.value.goals,
              manager:this.value.manager,
              sr:this.value.sr,
              //status:this.product.status
              } 
            )).then(() => {
              console.log("updated..");
              let alert = this.alertCtrl.create({
                title: 'Sucess',
                subTitle: 'Updated Sucessfully',
                buttons: [{text: 'OK',
                          handler: data => {
                         // this.navCtrl.setRoot(ProfilePage);
                          } 
                        }]
                      });
              alert.present();
            }).catch((err) => {
              console.log(err);
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: err,
                buttons: [{text: 'OK',
                          handler: data => {
                          // this.navCtrl.setRoot(ProfilePage);
                          } 
                        }]
                      });
            });
    
  }

}
