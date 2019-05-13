import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LazyComponent} from './lazy.component';
import {OAuthService} from 'angular-oauth2-oidc';
import {LazyRoutingModule} from './lazy-routing.module';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    CommonModule,
    LazyRoutingModule
  ]
})
export class LazyModule {
  constructor(
    private oauthService: OAuthService
  ) {
    if (!this.oauthService.hasValidAccessToken()) {
      throw new Error('No valid access token!');
    } else {
      console.log('Lazy Module loaded');
    }
  }
}
