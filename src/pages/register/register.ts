import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AuthserviceProvider } from '../../providers/authservice/authservice';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public showPassword: boolean = false;

  user = {} as User;
  
  constructor(private auth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public AuthProvider:AuthserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
   
signup(user:User){
  firebase.auth().createUserWithEmailAndPassword(user.email,user.password) 
  .then((data) => {
     let currentuser=firebase.auth().currentUser;
     console.log(currentuser);
      if(currentuser && data.emailVerified === false)
      {
        currentuser.sendEmailVerification().then
          {
            firebase.firestore().collection('Comapny').doc('Admin')
            .set(Object.assign({
              name: user.name,
              email: user.email,
              uid: currentuser.uid,
              company_name:user.company_name
            } 
            ))
         
           window.localStorage.setItem('emailForSignIn', currentuser.email);
           let alert = this.alertCtrl.create({
            title: 'Sucess',
            subTitle: 'Verification link sent to you, Please check your Inbox',
            //scope: id,
            buttons: [{text: 'OK',
                      handler: data => {
                       this.navCtrl.push(LoginPage);
                      } 
                    }]
                  });
          alert.present();
          }    
      } 
      
      
    }).catch((err) => {
      console.log(err); 
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Error in Creating Account ' + err ,
        //scope: id,
        buttons: [{text: 'OK',
                  handler: data => {
                   this.navCtrl.push(RegisterPage);
                  } 
                }]
              });
      alert.present();
    });
 }

public onPasswordToggle(): void {
      this.showPassword = !this.showPassword;
 }

login()
{
  this.navCtrl.push(LoginPage);
}
}
