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
  customQueryParams: { audience: 'https://philly-vanilly.auth0.com/api/v2/' },
  redirectUri: `${window.location.origin}${environment.production ? '/init-auth' : ''}/index.html`,
  silentRefreshRedirectUri: `${window.location.origin}${environment.production ? '/init-auth' : ''}/silent-refresh.html`,
  clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV',
  scope: 'openid profile email',
  clearHashAfterLogin: true,
  showDebugInformation: true
};
configAuthZero.logoutUrl =
  `${configAuthZero.issuer}v2/logout?client_id=${configAuthZero.clientId}&returnTo=${encodeURIComponent(configAuthZero.redirectUri)}`;


// works only on localhost, redirect to custom github page is not allowed
const configKeycloak: AuthConfig = {
  issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
  redirectUri: window.location.origin + '/index.html',
  clientId: 'spa-demo',
  scope: 'openid profile email voucher',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  clearHashAfterLogin: true,
  showDebugInformation: true
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
          path: '',
          pathMatch: 'full',
          redirectTo: lazyPathValue
        },
        {
          path: lazyPathValue,
          loadChildren: './lazy/lazy.module#LazyModule',
          // here the guard is not significant because the module is loaded only when InitialAuthService calls the success-callback
          // but a guard would be a good place to check for detailed permissions/roles from the token and redirect to an error-page
          // if a specific user is not authorized
          canLoad: [HasValidTokenGuard],
          canActivate: [HasValidTokenGuard]
        }
      ],
      {
        preloadingStrategy: PreloadAllModules,
        // this allows #-hash-fragment scrolling. Removing the #-hash after the OAuth-redirect is required with this configuration
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
      useFactory: (initialAuthService: InitialAuthService) => () => initialAuthService.initAuth(),
      deps: [InitialAuthService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
