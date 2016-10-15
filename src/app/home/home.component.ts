import { Component } from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLarge } from './x-large';
import {UserDetails} from "../services/user";
import {tokenNotExpired, JwtHelper} from "angular2-jwt/angular2-jwt";
import {UserCRUDService} from "../services/user-crud.service";

declare var Auth0Lock;

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
      providers:[UserCRUDService],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent {
  profile:any;
  title = 'Meet The Need';
  errorMessage: string;
  status: string;
  mode = 'Observable';
  selection: any;
  constructor(private userCRUDService: UserCRUDService, public appState: AppState) {
    this.profile = JSON.parse(localStorage.getItem('profile'));
  }
  lock = new Auth0Lock('0CKZr9nRkW4Yp8XSlFbJhkqzJOEBLzsf', 'abhilashshrivastava.auth0.com');
  jwtHelper = new JwtHelper();

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
  }

  logout() {
    var self = this;
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    sessionStorage.clear();
    window.location.reload();
    self.loggedIn();
  }

  signin() {
    var self = this;
    this.lock.showSignin((err: string, profile: string, id_token: string) => {
      if (err){
        throw new Error(err);
      }
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', id_token);
      this.profile = JSON.stringify(profile);
      window.location.reload();
      self.loggedIn();
    });

  }

  signup(){
    var self = this;
    this.lock.showSignup((err: string, profile: UserDetails, id_token: string) => {
      if (err){
        throw new Error(err);
      }
      console.log(profile);
      console.log(id_token);
      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', id_token);
      this.profile = JSON.stringify(profile);
      this.saveUserDetails(profile);
      window.location.reload();
      self.loggedIn();

    })
  }

  resetPassword() {
    var self = this;
    this.lock.showReset((err: string, profile: string, id_token: string) => {
      if (err) {
        throw new Error(err);
      }
      self.loggedIn();
    });
  }
  loggedIn() {
    return tokenNotExpired();
  }

  saveUserDetails(userDetails: UserDetails){
    if (!userDetails) { return; }
    //noinspection TypeScriptUnresolvedFunction
    this.userCRUDService.save(userDetails)
        .subscribe(
            data  => this.status = JSON.stringify(data),
            error =>  this.errorMessage = <any>error
        );

  }
}
