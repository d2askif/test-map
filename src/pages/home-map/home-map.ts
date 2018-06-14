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
