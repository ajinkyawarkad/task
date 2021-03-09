import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore} from 'angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-edit-team-details',
  templateUrl: 'edit-team-details.html',
})
export class EditTeamDetailsPage {
value:any;
userInfo:any;
product:{first_name:'',last_name:'',email:'',role:''};

  constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,
    private alertCtrl:AlertController) {
    this.value = navParams.get('product');
    console.log(this.value);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTeamDetailsPage');
  }

  update(product){
    let currentuser=firebase.auth().currentUser;
    firebase.firestore().collection('Company').doc("COM#"+currentuser.uid).collection('Users').doc('bG2SsD8OcKwcwNEVbpES')
            .update(Object.assign({
              first_name: this.value.first_name,
              last_name: this.value.last_name,
              email:this.value.email,
              role:this.value.role
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
