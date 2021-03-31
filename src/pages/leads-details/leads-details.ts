import { Component } from '@angular/core';
import firebase from 'firebase';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallDetailsPage } from '../call-details/call-details';
import { EditLeadDetailsPage } from '../edit-lead-details/edit-lead-details';
import { TaskDetailsPage } from '../task-details/task-details';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,) {
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
  

}
