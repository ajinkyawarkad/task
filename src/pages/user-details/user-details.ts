import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditTeamDetailsPage } from '../edit-team-details/edit-team-details';
import { UserLicensesPage } from '../user-licenses/user-licenses';

import { UserlistPage } from '../userlist/userlist';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  Segments:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private auth:AngularFireAuth) {
    this.Segments="2";
  }

  ionViewWillLoad() 
    { 
      this.auth.authState.subscribe(data => {
        if(data.email && data.uid){
          console.log("userpage",data.email);         
      }
      });

    }
  
  displayuser(){
    this.navCtrl.push(UserlistPage);
  }
  userlicense()
  {
    this.navCtrl.push(UserLicensesPage);
  }
  edit()
  {
    this.navCtrl.push(EditTeamDetailsPage);
  }
  
}
