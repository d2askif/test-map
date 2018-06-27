import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { SignInPage } from '../pages/sign-in/sign-in';
import { AuthService } from '../services/auth.service';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  config = {
    apiKey: "AIzaSyDLzWQJKuU852J3M8cqcx-UtTsouCt12NE",
    authDomain: "test-bc7e2.firebaseapp.com",
    databaseURL: "https://test-bc7e2.firebaseio.com",
    projectId: "test-bc7e2",
    storageBucket: "test-bc7e2.appspot.com",
    messagingSenderId: "1041679653764"
  };
  isAuthenticated = false;
  displayName = 'user';
  photoUrl= './assets/profile.png';
  signin = SignInPage;
  tab = TabsPage;
  signup = SignUpPage
  currentPage: any;
  @ViewChild('nav') nav:NavController;
  constructor( platform: Platform, 
               statusBar: StatusBar,
               splashScreen: SplashScreen,
               private menuCtrl: MenuController,
               private authServise:AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(this.config);
    firebase.auth().onAuthStateChanged(user=>{
       if(user){
        this.nav.setRoot(this.tab);
         this.currentPage = this.tab;
         this.isAuthenticated = true;
       } else {
        this.nav.setRoot(this.signin);
        this.currentPage = this.signin;
        this.isAuthenticated = false;
       }
    })
  }



  onLoad(page:any){
    this.currentPage = page;
   this.nav.setRoot(page);
   this.menuCtrl.close();
  }
  onLogOut(){
    this.authServise.sinout()
    .then()
    .catch((error)=>{
      console.log( 'log out failed'+  error);
      });
      this.menuCtrl.close();
  }
  checkActive(page:any){
  return this.currentPage == page;
  }
}

