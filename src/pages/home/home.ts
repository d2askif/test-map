import {Component, ElementRef, ViewChild,NgZone} from '@angular/core';
import {Platform, NavController, AlertController} from "ionic-angular";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, LocationService, GoogleMapOptions, MyLocation, GoogleMapsMapTypeId, Geocoder, GeocoderResult, GeocoderRequest } from '@ionic-native/google-maps';
declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map')
  private mapElement:ElementRef;
  @ViewChild('searchInput') searchInput:ElementRef;
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

  GoogleAutocomplete:any;
  autocomplete :any;
  autocompleteItems:any;
  constructor(private zone:NgZone,private platform:Platform,public navCtrl: NavController,private geolocation : Geolocation) {
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   }
  
    
  ionViewDidLoad() {
    this.platform.ready().then(() => {
     
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
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

  updateSearchResults(){
    
    if(this.autocomplete.input =='') {
      this.autocompleteItems = [];
      return ;
    }
     
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions:google.maps.places.AutocompletePrediction[], status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction:google.maps.places.AutocompletePrediction) => {
            console.log(prediction);
            this.autocompleteItems.push(prediction);
          });
        });
      });
    // console.log('autocomplet');

  }
  onSearchCancel(){
    this.autocomplete.input = "";
    this.autocompleteItems = [];
  }
  onSearchClear() {
    this.autocomplete.input = "";
    this.autocompleteItems = [];
  }

  selectSearchResult(item:google.maps.places.AutocompletePrediction) {
    this.autocomplete.input = item.description;
    this.autocompleteItems=[];//remove the autocomplet list 
    let options: GeocoderRequest = {
      address: item.description
    };
    // Address -> latitude,longitude
    Geocoder.geocode(options)
    .then((results: GeocoderResult[]) => {
      console.log(results);
    
       this.map.addMarker({
        'position': results[0].position,
        'title':  JSON.stringify(results[0].position)
      }).then(()=>{
        
      });
    })

  }
  
}
