import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {InitialAuthService} from './initial-auth.service';
import {environment} from '../environments/environment';

const config: AuthConfig = {
  issuer: 'https://philly-vanilly.auth0.com/',
  redirectUri: `${window.location.origin}${environment.production ? '/init-auth' : ''}/index.html'`,
  clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV',
  scope: 'openid profile email',
  silentRefreshRedirectUri: `${window.location.origin}${environment.production ? '/init-auth' : ''}/silent-refresh.html'`,
};

config.logoutUrl = `${config.issuer}v2/logout?client_id=${config.clientId}&returnTo=${encodeURIComponent(config.redirectUri)}`;


// see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
const handleInitialAuth = (initialAuthService: InitialAuthService) => {
  return () => initialAuthService.initAuth();
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    OAuthModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'sec',
        loadChildren: './sec/sec.module#SecModule',
      }
    ])
  ],
  providers: [
    InitialAuthService,
    { provide: AuthConfig, useValue: config },
    {
      provide: APP_INITIALIZER,
      useFactory: handleInitialAuth,
      deps: [InitialAuthService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
