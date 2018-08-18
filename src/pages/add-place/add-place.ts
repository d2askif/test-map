import { Component, OnInit, ViewChild, ElementRef, PACKAGE_ROOT_URL } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, normalizeURL, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { place } from '../../models/place';
import firebase  from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

/**
 * Generated class for the AddPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage implements OnInit {
  @ViewChild("address") private addressElement:ElementRef;
  captureDataUrl:any;
  alertCtrl: AlertController;
  private location;
  ngOnInit(): void {
    
  }
  private images:Array<string> = [];
  constructor( public navCtrl: NavController, 
               public navParams: NavParams,
               private dataService:DataService,
              private loderCtrl:LoadingController,
              private imgPicker:ImagePicker,
              private camera:Camera,
              private toastCtrl:ToastController,
              private cropService:Crop
             ) {
              this.location={};
             }

  ionViewDidLoad() {
   // let input = this.addressElement.nativeElement.getElementsByTagName('input')[0];
    let input= document.getElementById('address').getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(input);

    //#############
    autocomplete.addListener('place_changed', ()=>{
     
      let place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert("No details available for input: '" + place.name + "'");
        return;
      }
/*
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true); */
      console.log('location2:=> ' + place.geometry.location.lat());
      
     this.location={
       lat: place.geometry.location.lat(),
       lng: place.geometry.location.lng(),
       address: place.formatted_address
       };
    
     

   
    });
    
    console.log('ionViewDidLoad AddPlacePage');
  }

addPlace(f:NgForm){
  alert('upload');
  let postData = {
    price:    f.value.price,
    bedroom:  f.value.bedroom,
    adress:   this.location.address,
    typeOfApartment: f.value.typeApartment,
    renterType: f.value.renterType
  }
  
 let loader = this.loderCtrl.create();
 loader.present();
   console.log("addres1=> " + f.value.address);
   
 this.dataService.storeData2(postData,this.images,this.location).then(()=>{
   f.resetForm();
   this.images= [];
  console.log('complet');
  loader.dismiss();
 

   }).catch((error)=>{
    
  console.log(error.message);
  loader.dismiss();
});  
  
  console.log(f);
}

 



 

showSuccesfulUploadAlert() {
  let alert = this.alertCtrl.create({
    title: 'Uploaded!',
    subTitle: 'Picture is uploaded to Firebase',
    buttons: ['OK']
  });
  alert.present();
  // clear the previous photo data in the variable
  this.captureDataUrl = "";
}




openImagePickerCrop(){
  this.imgPicker.hasReadPermission().then(
    (result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imgPicker.requestReadPermission();
      }
      else if(result == true){
        this.imgPicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
              this.cropService.crop(results[i], {quality: 75,targetHeight:384,targetWidth:480}).then(
                newImage => {
                  this.images.push(newImage);
                 // this.uploadImageToFirebase(newImage);
                },
                error => console.error("Error cropping image", error)
              );
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
}

openImagePicker(){
  this.imgPicker.hasReadPermission().then(
    (result) => {
      if(result == false){
        // no callbacks required as this opens a popup which returns async
        this.imgPicker.requestReadPermission();
      }
      else if(result == true){
        this.imgPicker.getPictures({
          maximumImagesCount: 1
        }).then(
          (results) => {
            for (var i = 0; i < results.length; i++) {
             // this.uploadImageToFirebase(results[i]);
            }
          }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
}



delete(index){
  if(this.images.length > index){
    this.images.splice(index);
  }
}

}
