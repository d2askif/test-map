import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { HomeMapPage } from '../pages/home-map/home-map';
import * as firebase from 'firebase';
import { SignInPage } from '../pages/sign-in/sign-in';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    config = {
      apiKey: "AIzaSyDLzWQJKuU852J3M8cqcx-UtTsouCt12NE",
      authDomain: "test-bc7e2.firebaseapp.com"
    };
  signin = SignInPage;
  homePage = HomePage;
  currentPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(this.config);
    firebase.auth().onAuthStateChanged(user=>{
       if(user){
         this.currentPage = this.homePage;
       } else {
        this.currentPage = this.signin;
       }
    })
  }
}

