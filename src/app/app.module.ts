import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';
import {HttpClientModule} from '@angular/common/http';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {InitialAuthService} from './initial-auth.service';
import {environment} from '../environments/environment';
import {LAZY_PATH} from './injection-tokens';
import {HasValidTokenGuard} from './has-valid-token-guard.service';

const configAuthZero: AuthConfig = {
  issuer: 'https://philly-vanilly.auth0.com/',
  // this is for the refresh token; https://community.auth0.com/t/how-to-troubleshoot-access-denied-due-to-service-not-found-error/6822/2
  // the audience parameter needs to match an existing API service identifier configured in the APIs section of your Dashboard
  customQueryParams: { audience: 'https://philly-vanilly.auth0.com/api/v2/' },
  redirectUri: `${window.location.origin}${environment.production ? '/init-auth' : ''}/index.html`,
  clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV',
  scope: 'openid profile email',
};

// works only on localhost, redirect to custom github page is not allowed
const configKeycloak: AuthConfig = {
  issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
  redirectUri: window.location.origin + '/index.html',
  clientId: 'spa-demo',
  scope: 'openid profile email voucher',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
};

configAuthZero.logoutUrl =
  `${configAuthZero.issuer}v2/logout?client_id=${configAuthZero.clientId}&returnTo=${encodeURIComponent(configAuthZero.redirectUri)}`;

// see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
const handleInitialAuth = (initialAuthService: InitialAuthService) => {
  return () => initialAuthService.initAuth();
};

const lazyPathValue = 'lazy';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    OAuthModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: lazyPathValue,
          loadChildren: './lazy/lazy.module#LazyModule',
          canLoad: [HasValidTokenGuard],
          canActivate: [HasValidTokenGuard]
        }
      ],
      {
        preloadingStrategy: PreloadAllModules,
        // this allows #-hash-fragment scrolling
        // without stripping the oidc hash with the redirect state before angular initialization, this config would produce a runtime error
        onSameUrlNavigation: 'reload',
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }
    )
  ],
  providers: [
    InitialAuthService,
    { provide: LAZY_PATH, useValue: lazyPathValue },
    { provide: AuthConfig, useValue: configAuthZero },
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
