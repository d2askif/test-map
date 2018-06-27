import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { HomeMapPage } from '../pages/home-map/home-map';
import { GMap } from '../services/gmap.service';
import { SignInPage } from '../pages/sign-in/sign-in';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { TabsPage } from '../pages/tabs/tabs';
import { AddPlacePage } from '../pages/add-place/add-place';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HomeMapPage,
    SignInPage, 
    SignUpPage,
    TabsPage,
    AddPlacePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding:false,
      scrollAssist: true,
      autoFocusAssist: false}
    )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HomeMapPage,
    SignInPage,
    SignUpPage,
    TabsPage,
    AddPlacePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    GMap,
    AuthService,
    DataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
