import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DataService } from '../../services/data.service';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage implements OnInit {
  
  imageUrl:string;
  name:string;
  phoneNumber:string;
  imageChangedFlag= false;

  constructor(
    private dataService:DataService,
    private viewCtr:ViewController,
    private auth:AuthService,
    private camera:Camera,
    private cropService:Crop,
    private actionSheeCtrl:ActionSheetController,
    private loadCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }
  ngOnInit(): void {
    
    
  }
  ionViewDidEnter() {
    let user = this.auth.getActiveUser();
    if(user!=null) {
      this.name = user.displayName;
      this.imageUrl = user.photoURL;
      this.imageChangedFlag = this.imageUrl == null? false:true;
      this.phoneNumber = user.phoneNumber;
    }
  }
  
  pickImage(){
    var self = this;
 
    let actionSheet = self.actionSheeCtrl.create({
      title: 'Upload new image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            self.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Album',
          icon: 'folder-open',
          handler: () => {
            self.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
 
    actionSheet.present();

  }
  openCamera(pictureSourceType: any) {
    var self = this;
 
    let options: CameraOptions = {
      quality: 95,
      destinationType:this.camera.DestinationType.FILE_URI,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imageData => {
      this.cropService.crop(imageData, {quality: 75,targetHeight:384,targetWidth:480}).then(
        newImage => {
          this.imageUrl = newImage;
          this.imageChangedFlag = true;
          
        }
      ).catch((error) => {console.error("Error cropping image", error)});
     
      
     // self.startUploading(capturedImage);
    }).catch(error => {
      console.log('ERROR2 -> ' + JSON.stringify(error));
    });
  }
 

 saveChanges(){
   if(this.imageChangedFlag)
   
    this.dataService.uploadImageToFirebase(this.imageUrl,'profile_picture/' + this.auth.getActiveUser().uid).then((Url)=>{
      console.log('1');
      
      console.log("imageul saveChange" + Url);
      
    this.auth.updateProfile("daniel",Url).then(()=>{
      
      this.viewCtr.dismiss( {imgUrl:Url,displayName:"daniel"});
    }).catch(()=>{
      alert("update failed");
    });
  })
 }

  // discard changes and clost the modal view
  dismiss(){
    this.viewCtr.dismiss();
  }
}
