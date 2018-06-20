
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';

import 'rxjs/Rx';
import { place } from "../models/place";
import GeoFire from 'geofire';
@Injectable()
export class DataService {
  
  
  constructor(private httpClient: HttpClient){
 
  }
  addItem(name: string, amount: number) {
    
  }

  addItems() {
    
  }
  onUpdate() {
    
  }
  getItems(token) {
   // return this.ingredients.slice();
   // const userId =  this.authService.getActiveUser().uid;
  
    return this.httpClient.get<place>('https://test-bc7e2.firebaseio.com/map.json?auth='+token)
     
 
  }

  removeItem(index: number) {
   
  }
  storeList(token:any){
   // const userId = this.authService.getActiveUser().uid;
 return  this.httpClient.put('https://test-bc7e2.firebaseio.com/shoping-list.json?auth='+token,'this.ingredients')
 

  }
  load(){
    let firebaseRef = firebase.database().ref().push();
     let usersRef = firebaseRef.child('x');
     usersRef.set({
      alanisawesome: {
        date_of_birth: "June 23, 1912",
        full_name: "Alan Turing"
      },
      gracehop: {
        date_of_birth: "December 9, 1906",
        full_name: "Grace Hopper"
      }
    }).then(()=>{
      alert('success');
    }).catch(()=>{
      alert('error');
    });
    let geoFire = new GeoFire(firebaseRef);
   
    
    geoFire.set("some_key", [37.79, -122.41]).then(function() {
      alert('success');
      console.log("Provided key has been added to GeoFire");
    }, function(error) {
      alert('error');
      console.log("Error: " + error);
    });
  }
}
