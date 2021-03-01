import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditLeadDetailsPage } from '../edit-lead-details/edit-lead-details';
import { TaskDetailsPage } from '../task-details/task-details';


@IonicPage()
@Component({
  selector: 'page-leads-details',
  templateUrl: 'leads-details.html',
})
export class LeadsDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl:MenuController) {
   // this.menuCtrl.enable(false, 'menu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadsDetailsPage');
  }
  edit()
  {
    this.navCtrl.push(EditLeadDetailsPage);
  }
  calldetails()
  {
   this.navCtrl.push(TaskDetailsPage);
  }
}
