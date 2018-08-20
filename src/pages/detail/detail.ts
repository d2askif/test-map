import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  private url ='https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LIvrg3wG-rN_SjikT7E%2FimageName366179.0739151767?alt=media&token=1faa3705-5173-4d5d-b86c-f6a992a62341';
  slides =[];
  private item;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('item');
    for(let i=0; i<this.item.numberOfImages;i++){
      this.slides.push(this.item['img'+i]);
    }

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
