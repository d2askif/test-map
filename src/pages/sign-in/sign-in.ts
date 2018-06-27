import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { SignUpPage } from '../sign-up/sign-up';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
    
    
  }
signin(f:NgForm){
  console.log(f);
  
 firebase.auth().signInWithEmailAndPassword(f.value.email,f.value.password);
}
signup(){
  this.navCtrl.push(SignUpPage);
}

}
