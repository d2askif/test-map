import { Component } from '@angular/core';


import * as firebase from 'firebase';
import { HomeMapPage } from '../home-map/home-map';
import { AddPlacePage } from '../add-place/add-place';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  homeMapPage = HomePage;
  addPlace = AddPlacePage;
}
