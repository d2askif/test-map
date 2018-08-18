import { Component,Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase';

/**
 * Generated class for the UserAvatarComponentTsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-avatar-component-ts',
  templateUrl: 'user-avatar-component-ts.html'
})
export class UserAvatarComponentTsComponent implements OnInit {
  @Input() user:User;
  imageLoaded: boolean = false;
  imageUrl: string;
  UserInfo = {};
  

  constructor(private dataService:DataService, private auth:AuthService) {
    console.log('Hello UserAvatarComponentTsComponent Component');
  }
  ngOnInit(): void {
   if(this.user != null){
   this.UserInfo = this.user.displayName;
   this.UserInfo = this.user.phoneNumber;
   this.imageUrl = this.user.photoURL;
   }

  }


}
