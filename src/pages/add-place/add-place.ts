import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { DataService } from '../../services/data.service';

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
export class AddPlacePage {

  constructor( public navCtrl: NavController, 
               public navParams: NavParams,
               private dataService:DataService,
              private loderCtrl:LoadingController
              ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

addPlace(f:NgForm){
  let loader = this.loderCtrl.create();
  loader.present();
  this.dataService.storeList().then(()=>{
        console.log('complet');
        this.dataService.load().then(()=>{
          loader.dismiss();
        }).catch((error)=>{
          alert(error.message);
          loader.dismiss();
        });
       
         }).catch((error)=>{
           loader.dismiss();
        console.log(error);
  });
  
  console.log(f.value.price)
}

}
