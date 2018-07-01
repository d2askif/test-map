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
  Marker
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

            camera: {
              target: myLocation.latLng
            }
          }
          this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions)
          this.map.setCameraZoom(13);
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
        return;
      }
      alert('geba');
      const toast = this.toastCtrl.create({
        message: this.dataService.getNearByplaces().length + '',
        duration: 3000
      });
      toast.present();
      this.addCluster();
      // this.map.addMarker({

      //   'position': new LatLng(data.location[0], data.location[1]),
      //   'title': data.location + " "
      // }).then(() => {

      // });

      //this.map.setCameraTarget(this.dataService.dummyData()[0].position);
     // this.addCluster();
    })
  }



  addMarker(location: LatLng) {
    this.map.addMarker({
        title: 'My Marker',
        icon: {
          'url': 'assets/home.png'
        },
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
    this.autocomplete.input = "";
    this.autocompleteItems = [];
  }
  onSearchClear() {
    this.autocomplete.input = "";
    this.autocompleteItems = [];
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
        this.map.setCameraZoom(13);
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
    markers: this.dataService.dummyData(),
    icons: [
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
    marker.setTitle(marker.get("name"));
    marker.setSnippet(marker.get("address"));
    marker.showInfoWindow();
  });
}

}
