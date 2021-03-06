import { Component } from "@angular/core";
import {
  MenuController,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from "ionic-angular";
import { User } from "../../models/user";



import { HomePage } from "../home/home";
import { HomeManagerPage } from "../home-manager/home-manager";
import { RegisterPage } from "../register/register";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase";

import { Storage } from "@ionic/storage";
import { HomeUserPage } from "../home-user/home-user";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  public showPassword: boolean = false;

  user = {} as User;
  phone: string;
  coms = [];
  tenantId;
  showLogin = false
 

  name 
  email 
  cuid 
  role
  tenant 
   pass 

  constructor(
    public auth: AngularFireAuth,
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.menuCtrl.enable(false, "menu");
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Please wait...",
    });
    loading.present();
    this.storage.get("email").then(val => {
    

      if(val != null){

        this.storage.get("tenant").then(tenantId =>{
          this.storage.get("userId").then(uid => {
            firebase.firestore().collection("Company").doc(tenantId).collection("Users").doc(uid).get().then(doc =>{
              if(!doc.exists){
                this.role = "Admin"
              
                this.storage.get("tenant").then(ten => {
                  this.storage.get("email").then(ema => {
                    this.storage.get("password").then(pass =>{
                      firebase.auth().tenantId = ten
      
                      firebase.auth()
                      .signInWithEmailAndPassword(ema,pass)
                      .then((user) => {
                        let currentuser = firebase.auth().currentUser;
                        firebase.auth().onAuthStateChanged((data) => {
                          if (
                            currentuser.photoURL &&
                            currentuser &&
                            data.emailVerified === true
                          ) {
                            this.navCtrl.setRoot(HomePage)
                            loading.dismiss();
                          } else { //=============================
                            
                            let alert = this.alertCtrl.create({
                              title: "Error",
                              subTitle: "Email not verified please check your inbox",
                              buttons: [
                                {
                                  text: "OK",
                                  handler: (data) => {
                                    this.navCtrl.setRoot(LoginPage);
                                   
                                  },
                                },
                              ],
                            });
                            alert.present();
                          }
                        });
                      })
                      .catch((err) => {
                      
                        let alert = this.alertCtrl.create({
                          //title: 'Error',
                          subTitle: err,
                          buttons: [{ text: "OK", handler: (data) => {} }],
                        });
                        alert.present();
                      });
                    })
                  })
                })

              }else{
                this.role = doc.data().role
             
                switch (this.role){
                  case "Manager":
                    this.storage.get("tenant").then(ten => {
                      this.storage.get("email").then(ema => {
                        this.storage.get("password").then(pass =>{
                          firebase.auth().tenantId = ten
          
                          firebase.auth()
                          .signInWithEmailAndPassword(ema,pass)
                          .then((user) => {
                            let currentuser = firebase.auth().currentUser;
                            firebase.auth().onAuthStateChanged((data) => {
                              if (
                                currentuser.photoURL &&
                                currentuser &&
                                data.emailVerified === true
                              ) {
                                this.navCtrl.setRoot(HomeManagerPage)
                                loading.dismiss();
                               
                              } else { //=============================
                              
                                loading.dismiss();
                                // this.navCtrl.setRoot(LoginPage);
                                let alert = this.alertCtrl.create({
                                  title: "Error",
                                  subTitle: "Email not verified please check your inbox",
                                  buttons: [
                                    {
                                      text: "OK",
                                      handler: (data) => {
                                        this.navCtrl.setRoot(LoginPage);
                                      },
                                    },
                                  ],
                                });
                                alert.present();
                              }
                            });
                          })
                          .catch((err) => {
                            loading.dismiss();
                              let alert = this.alertCtrl.create({
                              //title: 'Error',
                              subTitle: err,
                              buttons: [{ text: "OK", handler: (data) => {} }],
                            });
                            alert.present();
                          });
                        })
                      })
                    })
                    
                    break;
          
                  case "Sale Representative":
                    this.storage.get("tenant").then(ten => {
                      this.storage.get("email").then(ema => {
                        this.storage.get("password").then(pass =>{
                          firebase.auth().tenantId = ten
          
                          firebase.auth()
                          .signInWithEmailAndPassword(ema,pass)
                          .then((user) => {
                            let currentuser = firebase.auth().currentUser;
                            firebase.auth().onAuthStateChanged((data) => {
                              if (
                                currentuser.photoURL &&
                                currentuser &&
                                data.emailVerified === true
                              ) {
                                this.navCtrl.setRoot(HomeUserPage)
                                loading.dismiss();
                              } else { //=============================
                             
                                loading.dismiss();
                                // this.navCtrl.setRoot(LoginPage);
                                let alert = this.alertCtrl.create({
                                  title: "Error",
                                  subTitle: "Email not verified please check your inbox",
                                  buttons: [
                                    {
                                      text: "OK",
                                      handler: (data) => {
                                        this.navCtrl.setRoot(LoginPage);
                                      },
                                    },
                                  ],
                                });
                                alert.present();
                              }
                            });
                          })
                          .catch((err) => {
                        
                            loading.dismiss();
                            let alert = this.alertCtrl.create({
                              //title: 'Error',
                              subTitle: err,
                              buttons: [{ text: "OK", handler: (data) => {} }],
                            });
                            alert.present();
                          });
                        })
                      })
                    })
                    
                    break;
          
                }
              }
            })
          })
        })
        
      switch (this.role){
        case "Admin":
          
          break;

        case "Manager":

          this.storage.get("tenant").then(ten => {
            this.storage.get("email").then(ema => {
              this.storage.get("password").then(pass =>{
                firebase.auth().tenantId = ten

                firebase.auth()
                .signInWithEmailAndPassword(ema,pass)
                .then((user) => {
                  let currentuser = firebase.auth().currentUser;
                  firebase.auth().onAuthStateChanged((data) => {
                    if (
                      currentuser.photoURL &&
                      currentuser &&
                      data.emailVerified === true
                    ) {
                      this.navCtrl.setRoot(HomeManagerPage)
                    } else { //=============================
                    
                      let alert = this.alertCtrl.create({
                        title: "Error",
                        subTitle: "Email not verified please check your inbox",
                        buttons: [
                          {
                            text: "OK",
                            handler: (data) => {
                              this.navCtrl.setRoot(LoginPage);
                            },
                          },
                        ],
                      });
                      alert.present();
                    }
                  });
                })
                .catch((err) => {
                
                  let alert = this.alertCtrl.create({
                    //title: 'Error',
                    subTitle: err,
                    buttons: [{ text: "OK", handler: (data) => {} }],
                  });
                  alert.present();
                });
              })
            })
          })
          
          break;

        case "User":
          this.storage.get("tenant").then(ten => {
            this.storage.get("email").then(ema => {
              this.storage.get("password").then(pass =>{
                firebase.auth().tenantId = ten

                firebase.auth()
                .signInWithEmailAndPassword(ema,pass)
                .then((user) => {
                  let currentuser = firebase.auth().currentUser;
                  firebase.auth().onAuthStateChanged((data) => {
                    if (
                      currentuser.photoURL &&
                      currentuser &&
                      data.emailVerified === true
                    ) {
                      this.navCtrl.setRoot(HomeUserPage)
                    } else { //=============================
                     
                      let alert = this.alertCtrl.create({
                        title: "Error",
                        subTitle: "Email not verified please check your inbox",
                        buttons: [
                          {
                            text: "OK",
                            handler: (data) => {
                              this.navCtrl.setRoot(LoginPage);
                            },
                          },
                        ],
                      });
                      alert.present();
                    }
                  });
                })
                .catch((err) => {
                
                  let alert = this.alertCtrl.create({
                    //title: 'Error',
                    subTitle: err,
                    buttons: [{ text: "OK", handler: (data) => {} }],
                  });
                  alert.present();
                });
              })
            })
          })
          
          break;

      }

      }else{
       
        this.showLogin = true
        loading.dismiss();
       
       
        
        

      }

      
    })
  
  }

  login(user: User) {
    if (user.email && user.password != null) {
      firebase.auth().tenantId = this.tenantId;

      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((user) => {
          let currentuser = firebase.auth().currentUser;
          firebase.auth().onAuthStateChanged((data) => {
            if (
              currentuser.photoURL &&
              currentuser &&
              data.emailVerified === true
            ) {
              firebase
                .firestore()
                .collection("Company")
                .doc(currentuser.photoURL)
                .collection("Users")
                .doc(currentuser.uid)
                .get()
                .then((doc) => {
                  if (!doc.exists) {
              
                    this.storage.set("name", currentuser.displayName);
                    this.storage.set("email", currentuser.email);
                    this.storage.set("cuid", currentuser.photoURL);
                    this.storage.set("userId", currentuser.uid);
                    this.storage.set("role","Admin")
                    this.storage.set("tenant",currentuser.photoURL)
                    this.storage.set("password",this.user.password)



                    

                    this.navCtrl.setRoot(HomePage);


                    
                  } else {
                    let role = doc.data().role;
                    switch (role) {
                      case "Manager":
                      
                        this.storage.set("name", currentuser.displayName);
                        this.storage.set("email", currentuser.email);
                        this.storage.set("userId", currentuser.uid);
                        this.storage.set("cuid", currentuser.photoURL);
                        this.storage.set("role","Manager")
                        this.storage.set("tenant",currentuser.photoURL)
                        this.storage.set("password",this.user.password)

                        this.navCtrl.setRoot(HomeManagerPage);
                        break;

                      case "Sale Representative":
                 
                        this.storage.set("name", currentuser.displayName);
                        this.storage.set("email", currentuser.email);
                        this.storage.set("cuid", currentuser.photoURL);
                        this.storage.set("userId", currentuser.uid);
                        this.storage.set("role","User")
                        this.storage.set("tenant",currentuser.photoURL)
                        this.storage.set("password",this.user.password)

                        this.navCtrl.setRoot(HomeUserPage);
                        break;
                    }
                    
                  }
                });

             
            } else {
            
              let alert = this.alertCtrl.create({
                title: "Error",
                subTitle: "Email not verified please check your inbox",
                buttons: [
                  {
                    text: "OK",
                    handler: (data) => {
                      this.navCtrl.setRoot(LoginPage);
                    },
                  },
                ],
              });
              alert.present();
            }
          });
        })
        .catch((err) => {

          let alert = this.alertCtrl.create({
            //title: 'Error',
            subTitle: err,
            buttons: [{ text: "OK", handler: (data) => {} }],
          });
          alert.present();
        });
    } else {
      let alert = this.alertCtrl.create({
        title: "Warning",
        subTitle: "Enter your Details",
        //scope: id,
        buttons: [
          {
            text: "OK",
            handler: (data) => {
              this.navCtrl.push(LoginPage);
            },
          },
        ],
      });
      alert.present();
    }
  } //signin ends

  ResetPassword() {
    let alert = this.alertCtrl.create({
      title: "Reset Password",
      inputs: [{ name: "email", placeholder: "Email" }],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
         
        },
        {
          text: "Reset Password",
          handler: (data) => {
            if (data.email) {
            
              const result = this.auth.auth.sendPasswordResetEmail(data.email);
              if (result) {
               
                let alert = this.alertCtrl.create({
                  title: "Success",
                  subTitle:
                    "Check Your Email For Reset Link to Change Password",
                  buttons: [
                    {
                      text: "OK",
                      handler: (data) => {
                        this.navCtrl.setRoot(LoginPage);
                      },
                    },
                  ],
                });
                alert.present();
              } else {
              
                let alert = this.alertCtrl.create({
                  title: "Error",
                  subTitle:
                    "Failed to send reset Link ,please check your Email",
                  buttons: [
                    {
                      text: "OK",
                      handler: (data) => {
                        this.navCtrl.setRoot(LoginPage);
                      },
                    },
                  ],
                });
                alert.present();
              }
            } else {
              return false;
            }
          },
        },
      ],
    });
    alert.present();
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  setTenant(id) {
    this.tenantId = id;
    
  }

  getCom() {
    firebase
      .firestore()
      .collection("Tenants")
      .doc(this.user.email)
      .get()
      .then((snap) => {
        if (snap.exists) {
          this.coms = snap.data().details;
        } else {
          alert("Create Account");
        }
      });
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }
}
