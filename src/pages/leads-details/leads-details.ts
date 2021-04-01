import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallDetailsPage } from '../call-details/call-details';
import { EditLeadDetailsPage } from '../edit-lead-details/edit-lead-details';
import { TaskDetailsPage } from '../task-details/task-details';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { LeadInTrackCampPage } from '../lead-in-track-camp/lead-in-track-camp';

interface Users {
  name: string,  
  manager:string; 
}

@IonicPage()
@Component({
  selector: 'page-leads-details',
  templateUrl: 'leads-details.html',
})
export class LeadsDetailsPage {

  value:any;
  userInfo:any;
  products: Observable<Users[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,
    public alertCtrl:AlertController) {
    this.value = navParams.get('product');
    console.log(this.value);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadsDetailsPage');
    let currentuser=firebase.auth().currentUser;
      this.userInfo = this.afs.collection('Company').doc("COM#"+currentuser.uid).collection('Campaigns').doc(this.value.cid)
      .collection('leads'); 
      this.products = this.userInfo.valueChanges();
     console.log('ionViewDidLoad TrackCampaignPage');
  }
  edit()
  {
    this.navCtrl.push(EditLeadDetailsPage);
  }
  add()
  {
    this.navCtrl.push(LeadInTrackCampPage,
      {
        product:this.value
      });
    
  }
  gotocall(id)
    {
      console.log("ljj mnmn",id);
      this.navCtrl.push(TaskDetailsPage, {
          product:this.value, 
          id
          
        });
    }
  calldetails()
    {
      this.navCtrl.push(CallDetailsPage);
    }
    showPopup(value) {
      let alert = this.alertCtrl.create({
        title: 'Confirm Delete',
        subTitle: 'Do you really want to delete?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'OK',
            
            handler: data => {
              console.log(value);
              this.deleteItem1(value);
  
            }
          }
        ]
      });
      alert.present();
    }
   
  
    deleteItem1(value1)
    {
  
    let currentuser=firebase.auth().currentUser;
    this.afs.collection('Company').doc("COM#"+currentuser.uid+'/' +'Campaigns' +'/'+
    this.value.cid+'/'+'leads'+'/'+value1).delete();
      
    }

}
