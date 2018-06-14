import {Component, ElementRef, ViewChild} from '@angular/core';
import {Platform, NavController, AlertController} from "ionic-angular";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, LocationService, GoogleMapOptions, MyLocation, GoogleMapsMapTypeId } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map')
  private mapElement:ElementRef;
  private locations:Array<any> = [];
 private location:LatLng;
  public map: GoogleMap;
  public directionsService: any;
  public directionsDisplay: any;
  public currentPosition: any;
  public placesService: any;
  public currentLocationDetails: any;
  public geocoder: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  googleMaps:GoogleMaps;

  constructor(private platform:Platform,public navCtrl: NavController,private geolocation : Geolocation) {

  }
  
    
  ionViewDidLoad() {
    this.platform.ready().then(() => {
      LocationService.getMyLocation()
      .then((myLocation:MyLocation)=>{
        this.location = myLocation.latLng;
        let mapOptions:GoogleMapOptions = {
          
          mapType:"MAP_TYPE_ROADMAP",
          controls:{
           compass:true,
           myLocationButton:true,
           indoorPicker:true,
           zoom:true,
           mapToolbar:true
          },
          camera:{
            target:myLocation.latLng
          }
        }
      this.map = GoogleMaps.create(this.mapElement.nativeElement,mapOptions)
      this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
        
        setTimeout(() => {this.addMarker()}, 500);
      })
      })
      .catch();
       

      
    });
  }
  


  addMarker() {
    this.map.addMarker({
      title: 'My Marker',
      icon: 'blue',
      animation: 'DROP',
      position: this.location
    })
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('Marker Clicked');
      });
    });
  }

 


 
  
}
