/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {UserCRUDService} from "./services/user-crud.service";
import {AppState} from "./app.service";
import {JwtHelper, tokenNotExpired} from "angular2-jwt/angular2-jwt";
import {UserDetails} from "./services/user";
declare var Auth0Lock;

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html',
  providers:[UserCRUDService]
})
export class AppComponent {
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

  selectionChange(event) {
    this.selection = '';
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

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
