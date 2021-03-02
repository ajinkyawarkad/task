import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthserviceProvider {
 
  public userProfileRef:firebase.database.Reference;
  constructor(public http: HttpClient) {
    
    console.log('Hello AuthserviceProvider Provider');
  }

  // signup(name:string,email:string,password:string)
  // {

  //   return new Promise((resolve, reject) =>{
  //   firebase.auth().createUserWithEmailAndPassword(email,password).then(newUser => {
  //     this.userProfileRef.child(newUser.uid).update({
  //       name:name,
  //       email: email,
  //       password: password
  //     });
  //   });
  //   });
  // }

}
