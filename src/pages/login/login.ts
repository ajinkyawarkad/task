import { Component } from '@angular/core';
import { IonicPage,  MenuController, NavController, NavParams,AlertController  } from 'ionic-angular';
import { User } from '../../models/user';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public showPassword: boolean = false;

  user = {} as User;

  constructor(public auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams , 
    public menuCtrl : MenuController,private alertCtrl: AlertController) {
    this.menuCtrl.enable(false, 'menu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
    const result = this.auth.auth.signInWithEmailAndPassword(user.email,user.password);
     firebase.auth().onAuthStateChanged((data)=>{
          console.log(data.emailVerified);
              if (data.emailVerified == true) {
                console.log('Email is verified');
                 this.navCtrl.push(HomePage);
              }
              else {
                console.log('Email is not verified');
               // this.navCtrl.setRoot(LoginPage);
               let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Email not verified please check your inbox',
                buttons: [{text: 'OK',
                          handler: data => {
                           this.navCtrl.push(LoginPage);
                          } 
                        }]
                      });
              alert.present();
              }
            });
          }
    catch(e)
    {
      console.error(e);
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please check your login credentials' + e + 'Pls try again',
        buttons: [{text: 'OK',
                  handler: data => {
                   this.navCtrl.push(LoginPage);
                  } 
                }]
              });
      alert.present();
    }
    }

    ResetPassword()
    {
      let alert = this.alertCtrl.create({
        title: 'Reset Password',
        inputs: [{name: 'email', placeholder: 'Email'} ],
        buttons: [{text: 'Cancel',role: 'cancel',
               handler: data => {
               console.log('Cancel clicked');
            }
          },
          {
            text: 'Reset Password',
            handler: data => {
              if (data.email) {
                console.log(data.email);
                const result =this.auth.auth.sendPasswordResetEmail(data.email);
                if(result)
                {
                  console.log("Check Your Email For Reset Link");
                  let alert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Check Your Email For Reset Link to Change Password',
                    buttons: [{text: 'OK',
                              handler: data => {
                               this.navCtrl.push(LoginPage);
                              } 
                            }]
                          });
                  alert.present();
                }
                else{
                  console.log("Error  in Sending Reset Link");
                  let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Failed to send reset Link ,please check your Email',
                    buttons: [{text: 'OK',
                              handler: data => {
                               this.navCtrl.push(LoginPage);
                              } 
                            }]
                          });
                  alert.present();
                }
              } else {
                
                return false;
              }
            }
          }
        ]
      });
      alert.present();
    }

    register(){
      this.navCtrl.push(RegisterPage);
      }

      public onPasswordToggle(): void {
        this.showPassword = !this.showPassword;
      }
     
}
