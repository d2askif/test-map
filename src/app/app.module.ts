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
import { ListingsPage } from '../pages/listings/listings';
import { SettingsPage } from '../pages/settings/settings';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HomeMapPage,
    SignInPage, 
    SignUpPage,
    TabsPage,
    AddPlacePage,
    ListingsPage,
    SettingsPage,
    ProfilePage,
    EditProfilePage
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
    AddPlacePage,
    ListingsPage,
    SettingsPage,
    ProfilePage,
    EditProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    ImagePicker,
    GMap,
    AuthService,
    DataService,
    Camera,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
