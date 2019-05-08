import {Component} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-lazy',
  template: `
    <div style="text-align:center">
      <h1>Welcome! This was loaded lazily after login</h1>
    </div>
    <p style="word-break: break-word">
      <span style="font-weight: bold">Your access token is: </span>
      {{ accessToken }}
    </p>
    <div style="margin-top: 30px;">
      <div>Expires at {{ accessTokenExpiration }}</div>
      <button (click)="onLogoutClick()">Logout</button>
    </div>
    <div>
      <button (click)="onSilentRefreshClick()">Silent Refresh</button> (only Keycloak)
    </div>
  `
})
export class LazyComponent {
  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  get accessTokenExpiration(): string {
    return new Date(this.oauthService.getAccessTokenExpiration()).toLocaleString();
  }

  constructor(
    private oauthService: OAuthService
  ) {}

  onLogoutClick() {
    this.oauthService.logOut();
  }

  onSilentRefreshClick() {
    this.oauthService.silentRefresh();
  }
}
