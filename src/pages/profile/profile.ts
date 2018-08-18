import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  private profileImageUrl ="assets/profile.png";
  private displayname = "User";
  private phoneNumber = "****";

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private modalCtrl:ModalController,
     private auth:AuthService) {
  }
 ngOnInit(){
 const user = this.auth.getActiveUser();
 let photoUrl =  this.auth.getActiveUser().photoURL;
 if(photoUrl!= null){
   this.profileImageUrl = photoUrl;
   this.displayname = this.auth.getActiveUser().displayName;
   this.phoneNumber = this.auth.getActiveUser().phoneNumber;
 }
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  editProfile(){
    const modal =  this.modalCtrl.create(EditProfilePage)
    modal.onDidDismiss(data=>{
      if(data!=null){
      this.profileImageUrl = data.imgUrl;
      this.displayname     = data.dispalyName;
      }
    })
    modal.present();
  }

}
