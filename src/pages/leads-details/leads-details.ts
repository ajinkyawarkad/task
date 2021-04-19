import { Component } from '@angular/core';
import firebase from 'firebase';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallDetailsPage } from '../call-details/call-details';
import { EditLeadDetailsPage } from '../edit-lead-details/edit-lead-details';
import { TaskDetailsPage } from '../task-details/task-details';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { LeadInTrackCampPage } from '../lead-in-track-camp/lead-in-track-camp';
import { Lead } from '../../models/user';
import * as $ from "jquery";

interface Users {
name: string,
manager:string;
}

@IonicPage()
@Component({
selector: 'page-leads-details',
templateUrl: 'leads-details.html',
})
export class LeadsDetailsPage {
  p: number = 1;
  public hideMe: boolean = false;
  public hideMe1: boolean = false;
  public hideMe2: boolean = false;
  
value:any;
userInfo:any;
products: Observable<Users[]>;
productss: Observable<Users[]>;
productsss: any;
public anArray:any=[];
public det:any=[];
public hed=[];
public array=[];
public leaduid:any;
public campid :any;

lead = {} as Lead;
isIndeterminate:boolean;
  masterCheck:boolean;


constructor(public navCtrl: NavController, public navParams: NavParams,public afs: AngularFirestore,
public alertCtrl:AlertController) {


this.value = navParams.get('product');
console.log(this.value);
this.campid =this.value.cid;

}
hide() {
  this.hideMe = !this.hideMe;
}
hide1() {
  this.hideMe1 = !this.hideMe1;
}
hide2() {
  this.hideMe2 = !this.hideMe2;
}
checkMaster() {
  setTimeout(()=>{
    this.productsss.forEach(obj => {

      obj.isChecked = this.masterCheck;
      if (obj.isChecked == true){
        this.leaduid=obj.uid
        this.array.push(obj.uid)
          console.log(this.array)  ;
          this.hide();           
      }   
    });
  });
}

checkEvent(lead:Lead) {
  const totalItems = this.productsss.length;
  let checked = 0;
  this.productsss.map(obj => {
    if (obj.isChecked == true){
    // checked++;
       console.log(obj.uid);
       this.array.push(obj.uid)
       console.log(this.array)  ;
       this.hide();
    }                             
  });

  if (checked > 0 && checked < totalItems) {
    this.isIndeterminate = true;
    this.masterCheck = false;
    
  } else if (checked == totalItems) {
    //If all are checked
    this.masterCheck = true;
    this.isIndeterminate = false;
    
  } else {
    //If none is checked
    this.isIndeterminate = false;
    this.masterCheck = false;
   
  }
}
insertsr(lead:Lead){
  console.log(this.value.cid);
  console.log(this.array);
  let currentuser=firebase.auth().currentUser;
  let i;
  for(i=0;i<this.array.length;i++){
    lead.sId='d63af2dc-b7bc-49c2-9063-23f470ed740c';
    
  firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.value.cid)
  .collection('leads').doc(this.array[i]).update({
    sr:lead.sId
  })
    
  }
  console.log(lead.sr)
  
  
}
ionViewDidLoad() {
  $(document).on('change', 'table thead input', function() {
    var checked = $(this).is(":checked");

    var index = $(this).parent().index();
        $('table  tr').each(function() {
            if(checked) {
                $(this).find("td").eq(index).show(); 
                $(this).find("th").eq(index).show(); 
                
            } else {
                $(this).find("td").eq(index).hide();  
                $(this).find("th").eq(index).hide(); 
            }
        });
});

console.log('ionViewDidLoad LeadsDetailsPage');

let currentuser=firebase.auth().currentUser;
firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Campaigns').doc(this.value.cid).onSnapshot((doc) => {
var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
// console.log(source, " data: ");
this.products = doc.data().CSVfield ;
//this.proStatus = doc.data().status;
// console.log(this.products) ;

});


this.userInfo = this.afs.collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid);
this.productss = this.userInfo.valueChanges().Users ;

firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid).onSnapshot((doc) => {
var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
console.log(source, " data: ");
this.productss = doc.data().Users ;
console.log(this.productss) ;
});



firebase.firestore().collection('Company').doc("COM#"+currentuser.uid).collection('Campaigns')
.doc(this.value.cid).collection('leads').get().then((snaps) =>{
snaps.docs.forEach(doc =>{

this.hed.push(doc.data());
var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
console.log(source, " data: " ,);

this.productsss=this.hed;
console.log('HHHHHHH',this.productsss);

})
 })
 
console.log('ionViewDidLoad TrackCampaignPage');
}

edit(product)
{
console.log("edit",product)
this.navCtrl.push(EditLeadDetailsPage, {
  product:product,
  campid:this.campid,
  //proStatus:this.proStatus
 
});
}
add()
{
this.navCtrl.push(LeadInTrackCampPage,
{
product:this.value
});

}
gotocall(id)
{
console.log(id);
this.navCtrl.push(TaskDetailsPage, {
product:this.value,
id

});
}
calldetails()
{
this.navCtrl.push(CallDetailsPage);
}
showPopup(value) {
let alert = this.alertCtrl.create({
title: 'Confirm Delete',
subTitle: 'Do you really want to delete?',
buttons: [
{
text: 'Cancel',
role: 'cancel',
handler: () => {
}
},
{
text: 'OK',

handler: data => {
console.log(value);
this.deleteItem1(value);

}
}
]
});
alert.present();
}

 
deleteItem1(value1)
{

let currentuser=firebase.auth().currentUser;
this.afs.collection('Company').doc("COM#"+currentuser.uid+'/' +'Campaigns' +'/'+
this.value.cid+'/'+'leads'+'/'+value1).delete();

}
}