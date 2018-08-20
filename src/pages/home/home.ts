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
  ToastController,
  ModalController
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
import { ListingsPage } from '../listings/listings';
import { DetailPage } from '../detail/detail';
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
  private zoomLavel = 11;

  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  total_markers=[];
  htmlInfoWindow =  new HtmlInfoWindow();
  constructor(
    private alertCtr: AlertController,
    private zone: NgZone,
    private platform: Platform,
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private authService: AuthService,
    private dataService: DataService,
    private loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    private modalCtrl:ModalController) {
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
            styles: [{"stylers": [{ "saturation": -20 }]}],

            camera: {
              target: myLocation.latLng
            }
          }
          this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions)
          this.map.setCameraZoom(this.zoomLavel);
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
     
     
     // this.addCluster2(); // adds cluster to the map if markers number is min 4 
      this.dataService.getNearByplaces().forEach(item => {
        this.addMarker2(item);
      });
 
      
      this.loader.dismiss();
     
    })
  }



  addMarker(location: LatLng) {
    /* 
     used to draw currnt location marker
     */
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
        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          alert('Marker Clicked');
        });
      });
  }
  addMarker2(data) {
    /* 
     used to draw currnt location marker
     */



    this.map.addMarker({
        draggable :true,
        disableAutoPan :true,
        
        icon:{
          'url': 'assets/Home_7.png',
          
           
      
        size:{
          width:48,
          height:48
        }
      }
      ,
        animation: 'DROP',
        position: {
          lat: data.location[0],
          lng: data.location[1]
        },
        

      })
      .then(marker => {
       // marker.showInfoWindow();
        this.total_markers.push(marker);
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
         /*  this.map.animateCamera({
            target: { lat: marker.getPosition().lat, lng: marker.getPosition().lng },
            duration: 300,
           // padding: 0  // default = 20px
          }); */
          let frame : HTMLElement = document.createElement('div');
console.log(this.dataService.result[data.key].img0);

frame.innerHTML = [
  '<div class="html-info-window">',
  '<ul>',
  '<li>',
  '<img src=' + this.dataService.result[data.key].img0+'></img>',
  '<h5>'+ this.dataService.result[data.key].price+ ' USD</h5>',
  '<p>'+this.dataService.result[data.key].renterType +'</p>',
  '<p>'+this.dataService.result[data.key].bedroom+' bedroom</p>',
  '<p>'+this.dataService.result[data.key].typeOfApartment +'</p>',
  '</li>',
  '</ul>',
  '</div>'
  //'<h5 style="padding:0, margin:0;">Hearts Castel </h5>',
  //'<img style="height:80px; width:110px; border:1px solid #dedede;"src=' + this.dataService.result[data.key].img0+'></img>'
].join('');
 frame.getElementsByTagName('div')[0].addEventListener('click',()=>{
   this.navCtrl.push(DetailPage,{'item':this.dataService.result[data.key]});
}); 
this.htmlInfoWindow.setContent(frame,{width:'200px',height:'100px',margin:'0px'});
            this.htmlInfoWindow.open(marker);
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
    this.total_markers.forEach((marker)=>{
     marker.remove();
    });
    this.total_markers = [];
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
        this.map.setCameraZoom(this.zoomLavel);
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
  
  

  /** addToGeoFire()
   * adds location of the Add post to geofire location at '/map'
   * TODO: pass data 
   */
  
  addToGeoFire() {
    // this.dataService.addToGeoFire({
    //   lat: this.locationPos.lat,
    //   lng: this.locationPos.lng
    // });
  }
/* *
 *@param postion of search focus
 */
  search(centerPos: LatLng) {
     this.loader= this.loadCtrl.create();
     this.loader.present();
     this.total_markers = [];
     this.dataService.result = [];
    this.dataService.search(centerPos, this.searchRadius);
  }

  setting(){
    let modal = this.modalCtrl.create(SettingsPage);
    modal.onDidDismiss((searchParams)=>{
    
    })
    modal.present();
    //this.navCtrl.push(SettingsPage);
  }
  showList(){
    console.log('ShowList');
    
    this.navCtrl.push(ListingsPage,{});
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
/* * addCluster()
 *
 * defines the min and max number of markers in a cluster and their icon properties
 * 
 */
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
   /**
   * sets marker click properties 
   * @param comes is marker options fetched from dataService
   */
    let marker: Marker = params[1];
    
    marker.setTitle("350usd");
    marker.setSnippet('appartment,2bed room');
    marker.setIcon({ 
      url: 'assets/Home_6.png',
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
				

          
          
       // make ajax call to get image data url
    /*  var request = new XMLHttpRequest();
      request.open('GET', 'https://firebasestorage.googleapis.com/v0/b/test-bc7e2.appspot.com/o/-LJ9LWmUDEbA65kwQB2O%2FimageName307072.9916461514?alt=media&token=3e0d6072-f613-4995-8f0a-1507638ab25f', true);
      request.onreadystatechange = function() {
        // Makes sure the document is ready to parse.
    
          // Makes sure it's found the file.
          if(request.status == 200) {
            console.log('request 200');
            
           // img.src=request.responseText;
            loadCanvas(request.responseText);
          }
      
      };
      request.send(null);*/

    

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
         
          
let icon = {
    url: 'assets/Home_6.png',
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
  this.map.addMarker(marker).then((marker) => {
    marker.on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe((markerClickEvent) => {
        console.log("MARKER_CLICK");
      /*  this._ngZone.run(() => {
          let marker: Marker = markerClickEvent.pop();
          this.onMarkerClick(marker);
        });*/

      });
  });
  this.total_markers.push(marker);
 
 // this.markerCluster2.addMarker(marker);
  
  
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
