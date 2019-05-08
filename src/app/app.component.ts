import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align:center">
      <h1>Welcome</h1>
    </div>
    <p style="word-break: break-word">
      <span style="font-weight: bold">Your access token is: </span>
      {{ accessToken }}
    </p>
    <div style="margin-top: 30px;">
      <div>Expires at {{ accessTokenExpiration }}</div>
      <button (click)="onLogoutClick()">Logout</button>
      <button (click)="onSilentRefreshClick()">Silent Refresh</button>
    </div>
    <div style="margin-top: 30px;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  get accessTokenExpiration(): string {
    return new Date(this.oauthService.getAccessTokenExpiration()).toLocaleString();
  }

  constructor(
    private oauthService: OAuthService
  ) { }

  onLogoutClick() {
    this.oauthService.logOut();
  }

  onSilentRefreshClick() {
    this.oauthService.silentRefresh();
  }
}
