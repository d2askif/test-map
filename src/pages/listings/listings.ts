import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';

/**
 * Generated class for the ListingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listings',
  templateUrl: 'listings.html',
})
export class ListingsPage {
  arrayOfResult:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private dataService:DataService) {
   // this.arrayOfResult = this.dataService.result.slice();
   this.dataService.getNearByplaces().forEach(place =>{
   this.arrayOfResult.push(this.dataService.result[place.key]);
   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListingsPage');
  }

}
