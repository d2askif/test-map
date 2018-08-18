import {Component, ElementRef, ViewChild} from '@angular/core';
import {Platform, NavController, AlertController} from "ionic-angular";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 

@Component({
  selector: 'page-home-map',
  templateUrl: 'home-map.html'
})
export class HomeMapPage {

  @ViewChild('map')
  private mapElement:ElementRef;
  private locations:Array<any> = [];

  public map: any;
  public directionsService: any;
  public directionsDisplay: any;
  public currentPosition: any;
  public placesService: any;
  public currentLocationDetails: any;
  public geocoder: any;
  options : GeolocationOptions;
  currentPos : Geoposition;

  constructor(private platform:Platform,public navCtrl: NavController,private geolocation : Geolocation) {}
  
    
  ionViewDidLoad() {
    this.platform.ready().then(() => {
    this.getUserPosition();    //   let element = this.mapElement.nativeElement;
    //   this.map = this.googleMaps.create(element);

    //   this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    //     let options = {
    //       target: this.location,
    //       zoom: 8
    //     };

    //     this.map.moveCamera(options);
    //     //setTimeout(() => {this.addMarker()}, 2000);
    //     setTimeout(() => {this.addMarker()}, 500);
    //   });
    });
  }
  getUserPosition(){
   this.options = {
    enableHighAccuracy : false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

         this.currentPos = pos;     

        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
}
addMap(lat,long){

  let latLng = new google.maps.LatLng(lat, long);

  let mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  this.addMarker();

}

  // addMarker() {
  //   this.map.addMarker({
  //     title: 'My Marker',
  //     icon: 'blue',
  //     animation: 'DROP',
  //     position: this.location
  //   })
  //   .then(marker => {
  //     marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  //       alert('Marker Clicked');
  //     });
  //   });
  // }

 


  addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p><buttun id='tap' class='btn' (click)='onclick()'>add</button>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });
    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('tap').addEventListener('click', () => {
        //alert('Clicked');
        console.log("touch");

 });
});
}
onclick(){
 console.log('click');
 
}

  
}
/* 
import {
  Component,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import {
  Platform,
  NavController,
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition,
  PositionError
} from '@ionic-native/geolocation';
import {
  GoogleMap,
  GoogleMaps,
  GoogleMapsEvent,
  LatLng,
  LocationService,
  GoogleMapOptions,
  MyLocation,
  GoogleMapsMapTypeId,
  Geocoder,
  GeocoderResult,
  GeocoderRequest,
  Circle,
  MarkerCluster,
  Marker,
  MarkerIcon,
  MarkerClusterOptions,
  MarkerOptions,
  HtmlInfoWindow
} from '@ionic-native/google-maps';
import {
  Observable
} from 'rxjs/Observable';
import {
  AuthService
} from '../../services/auth.service';
import {
  DataService
} from '../../services/data.service';
import {
  place
} from '../../models/place';
import { SettingsPage } from '../settings/settings';
declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public loader:any;
  private markerCluster2: MarkerCluster;
  @ViewChild('map')
  private mapElement: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  private locations: Array < any > = [];
  private location: LatLng;
  public map: GoogleMap;
  public directionsService: any;
  public directionsDisplay: any;
  public currentPosition: any;
  public placesService: any;
  public currentLocationDetails: any;
  public geocoder: any;
  options: GeolocationOptions;
  currentPos: Geoposition;
  googleMaps: GoogleMaps;
  private locationPos: LatLng;
  private centerPos: LatLng;
  private searchRadius: number;
  private circleArray: Array < Circle > ;
  private circle: Circle;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  constructor(private alertCtr: AlertController,
    private zone: NgZone,
    private platform: Platform,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private authService: AuthService,
    private dataService: DataService,
    private loadCtrl: LoadingController,
    public toastCtrl: ToastController) {
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
    this.searchRadius = 12; //in km 


  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      LocationService.getMyLocation()
        .then((myLocation: MyLocation) => {
          this.location = myLocation.latLng;
          this.centerPos = myLocation.latLng
          let mapOptions: GoogleMapOptions = {

            mapType: "MAP_TYPE_ROADMAP",
            controls: {
              compass: true,
              myLocationButton: true,
              indoorPicker: true,
              zoom: true,
              mapToolbar: true
              
            },
            styles: [{"stylers": [{ "saturation": -100 }]}],

            camera: {
              target: myLocation.latLng
            }
          }
          this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions)
          this.map.setCameraZoom(17);
          this.map.setCameraTarget(myLocation.latLng);
          this.map.one(GoogleMapsEvent.MAP_READY).then(() => {

            this.addMarker(myLocation.latLng);

            // this.addCircle(myLocation.latLng);

          })
        })
        .catch();
    });
    this.dataService.key_enteredObservable$.subscribe((data) => {
      // alert(location);
      if (data == false) {
        const toast = this.toastCtrl.create({
          message: 'No places found',
          duration: 3000
        });
        toast.present();
        this.loader.dismiss();
        return;
      }
     // alert('geba');
      const toast = this.toastCtrl.create({
        message: this.dataService.getNearByplaces().length + '',
        duration: 3000
      });
      toast.present();
     
    
      this.addCluster2(); // adds cluster to the map if markers number is min 4 
     
    })
  }



  
    this.map.addMarker({
      title: 'Currnt location',
      icon:{
        'url': 'assets/Arrow_1.png',
    
      size:{
        width:48,
        height:48
      }
    }
    ,
      animation: 'DROP',
      position: location,
      

    })
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('Marker Clicked');
      });
    });
}

updateSearchResults(event) {

  // TODO: 
  // use Observeable to minimize api call by using debunce and filter and other rxjs objects 
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  if ((this.autocomplete.input.split('')).length < 3) { //check input length
    return;
  }


  this.GoogleAutocomplete.getPlacePredictions({
      input: this.autocomplete.input
    },
    (predictions: google.maps.places.AutocompletePrediction[], status) => {
      this.autocompleteItems = [];

      this.zone.run(() => {
        predictions.forEach((prediction: google.maps.places.AutocompletePrediction) => {
          console.log(prediction);
          this.autocompleteItems.push(prediction);
        });
      });
    });
  // console.log('autocomplet');

}
onSearchCancel() {
  this.onSearchClear();
}
onSearchClear() {
  this.autocomplete.input = ""; // clear the the search input 
  this.autocompleteItems = [];
  this.dataService.clearNearByPlaces();
}

selectSearchResult(item: google.maps.places.AutocompletePrediction) {
  this.autocomplete.input = item.description;
  this.autocompleteItems = []; //remove the autocomplet list 
  let options: GeocoderRequest = {
    address: item.description
  };
  // Address -> latitude,longitude
  Geocoder.geocode(options)
    .then((results: GeocoderResult[]) => {
      console.log(results);
      this.locationPos = new LatLng(results[0].position.lat, results[0].position.lng);
      this.map.setCameraZoom(17);
      //this.map.addCircleSync({location:})
      this.map.setCameraTarget(this.locationPos);
      this.search(this.locationPos);
      // this.addCircle(this.locationPos);


      //  this.map.addMarker({
      //   'position': results[0].position,
      //   'title':  JSON.stringify(results[0].position)
      // }).then(()=>{

      // });
    })

}
logOut() {
  this.authService.sinout();

}
load() {
  alert('load');
  this.dataService.load();
  // const loader = this.loadCtrl.create({content:'Loading Data'});
  // loader.present();
  // this.authService.getActiveUser().getIdToken().then((token:string)=>{
  // this.dataService.getItems(token).subscribe((data:place)=>{
  //     loader.dismiss();
  //   alert(data.price)
  // })
  // });
}




addToGeoFire() {
  // this.dataService.addToGeoFire({
  //   lat: this.locationPos.lat,
  //   lng: this.locationPos.lng
  // });
}

search(centerPos: LatLng) {
   this.loader= this.loadCtrl.create();
   this.loader.present();
  this.dataService.search(centerPos, this.searchRadius);
}

setting(){
  this.navCtrl.push(SettingsPage);
}

addCircle(ILatLng) {
  // Add circle
  //  this.circleArray.forEach((value)=>{
  //    value.remove();
  //  });
  // if(this.circleArray.pop() != undefined){
  //   (this.circleArray.pop()).remove();
  // }
  if (this.circle != undefined) {
    this.circle.setCenter(ILatLng);
    this.map.animateCamera({
      target: this.circle.getBounds()
    });
    return;
  }
  this.circle = this.map.addCircleSync({
    'center': ILatLng,
    'radius': 12000,
    'strokeColor': '#488aff',
    'strokeWidth': 2,
    'fillColor': '#f9fafa',
    'fillOpacity': 1
  });


  //this.circleArray.push(circle);
}

addCluster(){
let markerCluster: MarkerCluster =  this.map.addMarkerClusterSync({
  boundsDraw: false,
  markers: this.dataService.dummyData(), // marker options 
  icons: [ //icon propertieds for each cluster
      {min: 2, max: 100, url: "assets/filled-circle.png", anchor: {x: 16, y: 16}, label: {
        color: "white"
     }
    },
      {min: 100, max: 1000, url: "assets/home.png", anchor: {x: 16, y: 16}, label: {
        color: "white"
      }},
      { min: 1000, max: 2000, url: "assets/home.png", anchor: {x: 24, y: 24},
      label: {
        color: "white"
      }
    },
      {min: 2000, url: "assets/home.png",anchor: {x: 32,y: 32}, label: {
        color: "white"
      }}
  ]
});




markerCluster.on((GoogleMapsEvent.MARKER_CLICK)).subscribe((params)=>{
 
  let marker: Marker = params[1];
  
  marker.setTitle("350usd");
  marker.setSnippet('appartment,2bed room');
  marker.setIcon({ 
    url: 'assets/Home_5.png',
    size: {
        width: 48,
        height: 48
    }
    
});

marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(()=>{
  alert('click')
});
 marker.showInfoWindow();
});
}
addCluster2(){

this.map.addMarkerCluster({
   boundsDraw: false,
   markers: [], // marker options 
   icons: [ //icon propertieds for each cluster
       {min: 4, max: 100, url: "assets/filled-circle.png", anchor: {x: 16, y: 16}, label: {
         color: "white"
      }
     },
       {min: 100, max: 1000, url: "assets/filled-circle.png", anchor: {x: 16, y: 16}, label: {
         color: "white"
       }},
       { min: 1000, max: 2000, url: "assets/filled-circle.png", anchor: {x: 24, y: 24},
       label: {
         color: "white"
       }
     },
       {min: 2000, url: "assets/filled-circle.png",anchor: {x: 32,y: 32}, label: {
         color: "white"
       }}
   ]
 }).then((cluster)=>{
   this.markerCluster2 = cluster;
  this.markerCluster2.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params)=>{
   let marker: Marker = params[1];
   let x = 0;
        let canvas = [];
        canvas[x] = document.createElement('canvas');
        canvas[x].width = 180;
        canvas[x].height = 90;
        var context = canvas[x].getContext('2d');
       // function loadCanvas(imgUrl) {
          var img = new Image();
          img.onload =  function (){
           context.drawImage(this, 0, 0,50,50);
          }
          img.src =  'https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LJ9LWmUDEbA65kwQB2O%2FimageName307072.9916461514?alt=media&token=3e0d6072-f613-4995-8f0a-1507638ab25f';
       // }
      

        
        
   

  

 //	img.src = "https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LJ9LWmUDEbA65kwQB2O%2FimageName307072.9916461514?alt=media&token=3e0d6072-f613-4995-8f0a-1507638ab25f";
   //img.src = 'assets/profile.png';
   context.font = 'bolder 10pt arial';
   context.fillStyle = 'black';
   context.fillText( 12 , 70, 15);
   
   context.font = '8pt arial';
   context.fillStyle = 'black';
   context.fillText( 12 , 70, 30);
   //context.drawImage(img, 0, 0,50,50);
   context.font = '8pt arial';
   context.fillStyle = 'black';
   context.fillText(12 , 70, 45);
   //          context.font = '8pt arial';
   context.fillStyle = 'black';
   context.fillText( 12 , 70, 60);
   marker.setTitle(canvas[x].toDataURL());
   })
  
    console.log("Near by places length =>" + this.dataService.getNearByplaces().length);
    
   this.dataService.getNearByplaces().forEach(item => {
    this.createMarker(item,"");
  });
  this.loader.dismiss();

 });
}
createMarker(m: any, needToPush) {
        console.log(m);
        let x = 0;
        let canvas = [];
        canvas[x] = document.createElement('canvas');
        canvas[x].width = 180;
        canvas[x].height = 90;
        var context = canvas[x].getContext('2d');
       // function loadCanvas(imgUrl) {
          var img = new Image();
          img.onload =  function (){
           context.drawImage(this, 0, 0,50,50);
          }
          img.src =  'https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LJ9LWmUDEbA65kwQB2O%2FimageName307072.9916461514?alt=media&token=3e0d6072-f613-4995-8f0a-1507638ab25f';
       // }
      

        
        
  
  
       

      //	img.src = "https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LJ9LWmUDEbA65kwQB2O%2FimageName307072.9916461514?alt=media&token=3e0d6072-f613-4995-8f0a-1507638ab25f";
        //img.src = 'assets/profile.png';
        context.font = 'bolder 10pt arial';
        context.fillStyle = 'black';
        context.fillText( this.dataService.result[m.key].price , 70, 15);
        
        context.font = '8pt arial';
        context.fillStyle = 'black';
        context.fillText( this.dataService.result[m.key].adress , 70, 30);
        //context.drawImage(img, 0, 0,50,50);
        context.font = '8pt arial';
        context.fillStyle = 'black';
        context.fillText( this.dataService.result[m.key].renterType , 70, 45);
        //          context.font = '8pt arial';
        context.fillStyle = 'black';
        context.fillText( this.dataService.result[m.key].typeOfApartment , 70, 60);
        
let icon = {
  url: 'assets/Home_5.png',
  // This marker is 32 pixels wide by 32 pixels high.
  size: {
    width: 48,
    height: 48
  },
  // The origin for this image is (0, 0).
  origin: {
    x: 0,
    y: 0
  },
  // The anchor for this image is the base of the flagpole at (0, 32).
  anchor: {
    x: 16,
    y: 32
  }
};
let marker = {
 // title: canvas[x].toDataURL(),
  icon: icon,
  position: {
    lat: m.location[0],
    lng: m.location[1]
  }
}
marker["meta"] = m;


this.markerCluster2.addMarker(marker);


}

onMarkerClick(marker: Marker) {
var data = marker.get("meta");
this.map.animateCamera({
  target: { lat: marker.getPosition().lat, lng: marker.getPosition().lng },
  duration: 300,
  padding: 0  // default = 20px
});
marker.setSnippet("this marker clicked");
marker.setTitle("Marker");


marker.showInfoWindow();
}
}

 */