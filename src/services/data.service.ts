import {
  Injectable
} from "@angular/core";
import {
  HttpClient
} from '@angular/common/http';
import firebase from 'firebase';

import 'rxjs/Rx';
import {
  place
} from "../models/place";
import GeoFire from 'geofire';
import {
  LatLng
} from "@ionic-native/google-maps";
import {
  Observable,
  Observer
} from "rxjs/Rx";
import {
  AuthService
} from "./auth.service";
//import { normalizeURL } from "ionic-angular/umd";
@Injectable()
export class DataService {
  public result; //  {key,value} array
  private geoFire;
  private firebaseRef;
  private imageDownloadURL = [];
  private nearByPlacesFound: Array < {
    location,
    key
  } > =[];
  key_enteredObservable$: Observable < any > ;
  key_enteredObserver: Observer < any > ;
  newPostKey;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.firebaseRef = firebase.database().ref('/map');
    this.geoFire = new GeoFire(this.firebaseRef);
    this.key_enteredObservable$ = Observable.create((observer) => {
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

    return this.httpClient.get < place > ('https://test-bc7e2.firebaseio.com/map.json?auth=' + token)


  }

  removeItem(index: number) {

  }
  storeData(postData,imgURI) {

    return new Promise<any>((resolve,reject)=>{

      //get UserId to put data to users database section
      const userId = this.authService.getActiveUser().uid;
      // generet unique id for each post
      this.newPostKey = firebase.database().ref().child('posts').push().key;
      //upload image to firbase storage and get the url 
       
       this.uploadImageToFirebase(imgURI,this.newPostKey).then((snapshot)=>{
      
      postData.imgurl = snapshot.fullPath;
              
      let updates = {};
      // Write the new post's data simultaneously in the posts list and the user's post list.
      updates['/posts/' + this.newPostKey] = postData;
      updates['/users/' + userId + '/' + this.newPostKey] = postData;
  
      firebase.database().ref().update(updates)
      .then(()=>{
        resolve();
      }).catch(()=>{
        reject();
      });
      }).catch((err)=>{
        reject();
        console.error("error.=> " + err.message);
        
      })
      
    })
    
    
    

  }

  storeData2(postData,images,location){

    //empty the arry for image URL from firbase storage 
    this.imageDownloadURL = [];
    //get UserId to put data to users database section
    const userId = this.authService.getActiveUser().uid;
    
    // generet unique id for each post
    this.newPostKey = firebase.database().ref().child('posts').push().key;
    //upload image to firbase storage and get the url 
    
    return new Promise<any>((resolve,reject)=>{
    Promise.all(
     images.map(item=>this.uploadImageToFirebase(item,'upload/'+this.newPostKey))

    ).then((urls)=>{
/* @param 
-  url[] is the array of url(s) of the image stored on ifre base 

 */      
      console.log('promised URL'+ urls);
      
      let updates = {};
      // put number of images uploaded for this post 
      postData.numberOfImages = urls.length;
      urls.forEach((url,index)=>{
         postData['img'+index] = url;
      })
      
      console.log("Adress=>" + postData.adress);
      
      // Write the new post's data simultaneously in the posts list and the user's post list.
      updates['/posts/' + this.newPostKey] = postData;
      updates['/users/' + userId + '/' + this.newPostKey] = postData;

      firebase.database().ref().update(updates).then(()=>{
        this.geoFire.set(this.newPostKey,[location.lat,location.lng])
        .then(()=>{
          resolve();
        }).catch(()=>{
          reject();
        });
      }).catch(()=>{
       reject();
      });
    }).catch(()=>{
      reject();
    })
    })

  
  }
  load() {
    
    /* 
    ! used for loading static TEST Data
     */
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


    return this.geoFire.set(this.newPostKey, [55.6460162, 12.29717]);
  }

  addToGeoFire() {

    this.geoFire.set({
      "some_key": [12.2979341, 55.6460162],
      "another_key": [12.2970, 55.6460162],
      "some_key2": [12.2979331, 55.6460162],
      "another_key2": [12.2971, 55.6460162],
      "some_key3": [12.2979341, 55.6460142],
      "another_key3": [12.29704, 55.6460162],
      "some_key4": [55.6460162, 12.2979331],
      "another_key4": [55.6460162, 12.29717]
    }).then(() => {
     // alert('success');
      console.log("Provided key has been added to GeoFire");
    }).catch(() => {
     // alert('error');
    });
  }
  search(pos: LatLng, radius) {
    let keys=[];
    this.nearByPlacesFound = [];
    let noPlacesFound = false;
    let Query = this.geoFire.query({
      center: [pos.lat, pos.lng],
      radius: 12
    });
    let keyEnteered = Query.on('key_entered', (key, location, distance) => {
     // alert(location);
      this.nearByPlacesFound.push({
        location: location,
        key: key
      });
      keys.push(key);
      noPlacesFound = true;
      
    });
    let ready = Query.on('ready', () => {
      if (!noPlacesFound) {
        alert('no places found');
        this.key_enteredObserver.next(false);

      } else {
       /* 
       ! works for feaching a singl ke value d
       ! Dnot Delet
       let ref = firebase.database().ref('posts/-LGR7wEqjxrn_xSOmX5n');
        ref.once("value", function(snapshot) {
         alert(snapshot.val().adress);
      
      }).then(()=>{
        this.key_enteredObserver.next(true);
      }).catch(()=>{
        this.key_enteredObserver.next(false);
      }); 
      !end
      */


        this.getFirebaseData(keys).then((results)=>{
        this.result = results;
        
        this.key_enteredObserver.next(true);
        }).catch(()=>{
          this.key_enteredObserver.next(false);
        });
     //  this.key_enteredObserver.next(false);
       
      }
    });
}
getNearByplaces(){
  return this.nearByPlacesFound.slice();
}
 clearNearByPlaces(){
   this.nearByPlacesFound = [];
 }



  dummyData() {
    
  return [
    {
      "position": {
        "lat": 55.6460162,
        "lng": 12.2979331
      },
      "name": "Starbucks - HI - Aiea  03641",
      "address": "Aiea Shopping Center_99-115 Aiea Heights Drive #125_Aiea, Hawaii 96701",
      "phone": "808-484-0000",
      "icon": {
      ' url': "assets/Home_5.png",
      "size":{
        'width':32,
        'height':32
      }
    }
    },
     
    {
      "position": {
        "lat": 55.6460162,
        "lng": 12.29717
      },
      "name": "Starbucks - HI - Aiea  03642",
      "address": "Pearlridge Center_98-125 Kaonohi Street_Aiea, Hawaii 96701",
      "phone": "808-484-0000",
      "icon": "assets/home.png",
      
    },
    {
      "position": {
        "lat": 55.6460262,
        "lng": 12.2979331
      },
      "name": "Starbucks - HI - Aiea  03641",
      "address": "Aiea Shopping Center_99-115 Aiea Heights Drive #125_Aiea, Hawaii 96701",
      "phone": "808-484-0000",
      "icon": "assets/home.png"
    },
     
    {
      "position": {
        "lat": 55.6460162,
        "lng": 12.29817
      },
      "name": "Starbucks - HI - Aiea  03642",
      "address": "Pearlridge Center_98-125 Kaonohi Street_Aiea, Hawaii 96701",
      "phone": "808-484-0000",
      "icon": "assets/home.png"
    }
  ]
  
}





 getFirebaseData(key_arr) {
  
   //Test 
  // let arr=['-LG740HslWw2kEx0V8kC','-LG74H4dxzR5V5tgGGbw','-LGVET4nCXyQOXeSirlE','-LGVEUsRmaYGqLH42xVL','-LGWjeuxkZoj9iQ3I1AH']; 
  return Promise.all(key_arr.map( (key_str)=> {
      return new Promise(function (resolve, reject) {
        // alert(key_str);
          return firebase.database().ref('posts/' + key_str).once('value',  (snapshot)=> {
              return resolve([key_str, snapshot.val()]);
          });
      });
  })).then( (results)=> {
      return results.reduce((result, item) =>{
          let key = item[0];
         
             let  value = item[1];
          result[key] = value;
          return result;
      }, {});
  });
 }

 read(id){
   
    return firebase.database().ref('posts/'+'LGR7wEqjxrn_xSOmX5n').once('value').then(function(snapshot) {
     // alert(snapshot.val());
      return snapshot.val();
    });
  }
 loadImg(){
   firebase.storage().ref('app/' + this.newPostKey + '/' + new Date());
 }


 //#############
 encodeImageUri(imageUri, callback) {
  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  var img = new Image();
  img.onload = function () {
    var aux:any = this;
    c.width = aux.width;
    c.height = aux.height;
    ctx.drawImage(img, 0, 0);
    var dataURL = c.toDataURL("image/jpeg");
    callback(dataURL);
  };
  img.src = imageUri;
};

uploadImageToFirebase(imageURI,saveLocation):Promise<any>{
  return new Promise<any>((resolve, reject) => {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(saveLocation).child('imageName' + Math.random() * 1000000);
    this.encodeImageUri(imageURI, function(image64){
      imageRef.putString(image64, 'data_url')
      .then(snapshot => {
        // retrive all the image download links and to save them in data storage
         return snapshot.ref.getDownloadURL();
        }).then( (url)=>{
          // the download url link of firebase storage
          console.log('2');
          
          console.log("url>>>> "+url);
          
         resolve(url);
         }).catch( (err)=> {
          reject();
      })
    })
  })
}






}
