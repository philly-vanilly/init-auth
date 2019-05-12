import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AuthConfig, OAuthModule} from 'angular-oauth2-oidc';
import {InitialAuthService} from './initial-auth.service';
import {environment} from '../../environments/environment';

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


@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [
    InitialAuthService,
    { provide: AuthConfig, useValue: configAuthZero },
    {
      provide: APP_INITIALIZER,
      useFactory: (initialAuthService: InitialAuthService) => () => initialAuthService.initAuth(),
      deps: [InitialAuthService],
      multi: true
    },
  ],
})
export class AuthModule {}
