import {Component} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  template: `
     <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(
    private oauthService: OAuthService
  ) {
    if (!this.oauthService.hasValidAccessToken()) {
      throw new Error('No valid access token!');
    } else {
      console.log('Root component loaded');
    }
  }
}
