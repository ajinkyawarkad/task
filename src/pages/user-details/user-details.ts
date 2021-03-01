import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditTeamDetailsPage } from '../edit-team-details/edit-team-details';
import { UserLicensesPage } from '../user-licenses/user-licenses';
import { UserPage } from '../user/user';
import { UserlistPage } from '../userlist/userlist';

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  Segments:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.Segments="2";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailsPage');
  }
  newuser()
  {
    this.navCtrl.push(UserPage);

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
