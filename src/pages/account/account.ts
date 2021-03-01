import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { UserLicensesPage } from '../user-licenses/user-licenses';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }
  settings()
  {
    this.navCtrl.push(SettingsPage);
  }
  userlicenses()
  {
    this.navCtrl.push(UserLicensesPage);
  }

}
