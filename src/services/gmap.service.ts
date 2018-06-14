import {Component, ElementRef, ViewChild, Injectable} from '@angular/core';
import {Platform, NavController, AlertController, ModalController, NavParams, Events} from "ionic-angular";
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 


//Models
import { TripModel } from './../models/trip';
@Injectable()
export class GMap {

  public map: any;
  public directionsService: any;
  public directionsDisplay: any;
  public mapElement: ElementRef;
  public currentPosition: any;
  public placesService: any;
  public currentLocationDetails: any;
  public geocoder: any;

  constructor(
    public events: Events, public geolocation:Geolocation
  ) {}

  loadMap(mapElement: ElementRef) {

    this.mapElement = mapElement;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
        polylineOptions: {
        strokeColor: '#267fea',
        strokeWeight: 6
      },
      suppressMarkers: true
    });

    this.geocoder = new google.maps.Geocoder;

    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position:Geoposition) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.currentPosition = latLng;
      this.map = new google.maps.Map(mapElement.nativeElement, {
          center: latLng,
          zoom: 7,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
         
      
         // styles:[{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"lightness":20},{"weight":1}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"lightness":20},{"weight":1}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"color":"#f4f5f2"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e4e4e4"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#a1d675"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#1fc2ff"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#FFFFFF"},{"visibility":"on"}]}]
      })
      
     
     // let layer = new google.maps.TransitLayer();
    //  layer.setMap(this.map);

      //this.addMarker(latLng, 'user');

      this.placesService = new google.maps.places.PlacesService(this.map);

      this.geocoder.geocode({'location': latLng}, (results, status) => {
        if (status === 'OK') {
          this.currentLocationDetails = results;
          console.log('results ', results);
        }
      })

      //TODO: test

     //  var drawingManager = new google.maps.drawing.DrawingManager();
    //  drawingManager.setMap(this.map);

      // drawingManager.setOptions({
      //   drawingControlOptions: { }
      // });



    }).catch(this.handleError)
    this.listenEvents();
  }

  centerMap() {
    this.geolocation.getCurrentPosition({enableHighAccuracy: true})
    .then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
    }).catch(this.handleError)
  }


  addMarker(position: any, type: string) {
    var marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
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

  getPlaceDetails(request: any, callbak: any) {
    return this.placesService.getDetails(request, callbak);
  }

  getLocalPlaceDetails() {
    return this.currentLocationDetails.find(obj => {
      return obj.types[0] === 'administrative_area_level_2';
    });
  }

  startTripOnMap(data: TripModel) {
    console.log('data sent ', data);
    // { MODEL FOR REQUESTS
    //   origin: LatLng | String | google.maps.Place,
    //   destination: LatLng | String | google.maps.Place,
    //   travelMode: TravelMode,
    //   transitOptions: TransitOptions,
    //   drivingOptions: DrivingOptions,
    //   unitSystem: UnitSystem,
    //   waypoints[]: DirectionsWaypoint,
    //   optimizeWaypoints: Boolean,
    //   provideRouteAlternatives: Boolean,
    //   avoidHighways: Boolean,
    //   avoidTolls: Boolean,
    //   region: String
    // }
    this.directionsDisplay.setMap(this.map);
    let currentAddress = this.getLocalPlaceDetails().formatted_address;
    let  request = {origin: currentAddress, destination: data.where, travelMode: data.moveBy};
    this.directionsService.route(request, (result, status) => {
      console.log('result is: ', result);
      if (status == 'OK') {
        this.directionsDisplay.setDirections(result);
        this.events.publish('newTripStarted', result);
      }
    })
  }

  listenEvents() {
    this.events.subscribe('startTripOnMap', (data) => this.startTripOnMap(data));
  }


  public handleError(error: any) {
    console.error('An error occurred', error);
  }

  getLocation (){
   return  this.geolocation.getCurrentPosition({enableHighAccuracy: false})
  }

}
