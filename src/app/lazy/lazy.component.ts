import {Component} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {InitialAuthService} from '../auth/initial-auth.service';

@Component({
  selector: 'app-lazy',
  template: `
    <div style="text-align:center">
      <h1>Welcome! This was loaded lazily after login</h1>
    </div>
    <h3 style="font-weight: bold; margin-top: 30px;">Your access token (valid until {{ accessTokenExpiration }}): </h3>
    <pre style="word-break: break-word">{{ accessToken | json }}</pre>
    <h3 style="font-weight: bold; margin-top: 30px;">Your id token (valid until {{ idTokenExpiration }}): </h3>
    <pre style="word-break: break-word">{{ idToken | json }}</pre>
    <div style="margin-top: 30px;">
      <button (click)="onLogoutClick()">Logout</button>
      <div style="font-weight: bold;">Deeper Routing works: </div>
      <a style="margin-left: 10px" routerLink="a">Go to A</a>
      <a style="margin-left: 10px" routerLink="b">Go to B</a>
    </div>
    <router-outlet></router-outlet>
  `
})
export class LazyComponent {

  get accessToken(): string {
    return this.initalAuthService.decodedAccessToken;
  }

  get idToken(): string {
    return this.initalAuthService.decodedIDToken;
  }

  get accessTokenExpiration(): string {
    return new Date(this.oauthService.getAccessTokenExpiration()).toLocaleString();
  }

  get idTokenExpiration(): string {
    return new Date(this.oauthService.getIdTokenExpiration()).toLocaleString();
  }

  constructor(
    private oauthService: OAuthService,
    private initalAuthService: InitialAuthService
  ) {}

  onLogoutClick() {
    this.oauthService.logOut();
  }
}
