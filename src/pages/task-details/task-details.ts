import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditLeadDetailsPage } from '../edit-lead-details/edit-lead-details';


@IonicPage()
@Component({
  selector: 'page-task-details',
  templateUrl: 'task-details.html',
})
export class TaskDetailsPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskDetailsPage');
  }
  edit()
  {
    this.navCtrl.push(EditLeadDetailsPage)
  }

}
