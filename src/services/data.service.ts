
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';

import 'rxjs/Rx';
import { place } from "../models/place";
import GeoFire from 'geofire';
import { LatLng } from "@ionic-native/google-maps";
import { Observable, Observer } from "rxjs/Rx";
import { AuthService } from "./auth.service";
@Injectable()
export class DataService {
  private geoFire;
  private firebaseRef;
  key_enteredObservable$:Observable<any>;
  key_enteredObserver:Observer<any>;
  
  constructor(private httpClient: HttpClient,private authService:AuthService){
    this.firebaseRef = firebase.database();
    this.geoFire = new GeoFire(this.firebaseRef);
    this.key_enteredObservable$ = Observable.create((observer)=>{
   this.key_enteredObserver = observer;
    });
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
  storeList(){
    
    
    const userId = this.authService.getActiveUser().uid;
    let postData = {
      author: "username",
      uid: userId,
      body: "body",
      title: "title",
      starCount: 0,
      authorPic: "picture"
    };
  
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/users/' + userId + '/' + newPostKey] = postData;
  
    return firebase.database().ref().update(updates);

  }
  load(){
    // let firebaseRef = firebase.database().ref('map/')
    //  let usersRef = firebaseRef.child('x');
    //  usersRef.set({
    //   alanisawesome: {
    //     date_of_birth: "June 23, 1912",
    //     full_name: "Alan Turing"
    //   },
    //   gracehop: {
    //     date_of_birth: "December 9, 1906",
    //     full_name: "Grace Hopper"
    //   }
    // }).then(()=>{
    //   alert('success');
    // }).catch(()=>{
    //   alert('error');
    // });
   
    
    this.geoFire.set("some_key", [32.345, -122.41]).then(function() {
      alert('success');
      console.log("Provided key has been added to GeoFire");
    }, function(error) {
      alert('error');
      console.log("Error: " + error);
    });
  }

  addToGeoFire(pos){
    
    this.geoFire.set({ 
      "some_key": [12.2979341,55.6460162],
      "another_key": [ 12.2970,55.6460162],
      "some_key2": [ 12.2979331,55.6460162],
      "another_key2": [12.2971,55.6460162],
      "some_key3": [ 12.2979341,55.6460142],
      "another_key3": [ 12.29704,55.6460162],
      "some_key4": [55.6460162, 12.2979331],
      "another_key4": [55.6460162, 12.29717]
    }).then(() =>{
      alert('success');
      console.log("Provided key has been added to GeoFire");
    }).catch(()=>{
      alert('error');
    });
  }
  search(pos:LatLng,radius){
    let noPlacesFound =false;
     let Query = this.geoFire.query({
      center: [pos.lat, pos.lng],
      radius: 12
    });
   let keyEnteered = Query.on('key_entered',(key, location, distance)=>{
      noPlacesFound = true;
      this.key_enteredObserver.next(location);
  });
  let ready = Query.on('ready',()=>{
    if(!noPlacesFound){
     // alert('no places found');
      this.key_enteredObserver.next(null);

    } else {
     // alert('places found');
    }
});
  

  }
}
