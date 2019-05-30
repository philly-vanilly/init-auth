import {Injectable, Injector} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {JwtHelperService} from '@auth0/angular-jwt';
import {filter} from 'rxjs/operators';
import {APP_BASE_HREF, DOCUMENT} from '@angular/common';

// works only on localhost, redirect to custom github page is not allowed. username/password = max/geheim
const configIdentityServer4Localhost: AuthConfig = {
  issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
  redirectUri: window.location.origin + '/index.html',
  clientId: 'spa-demo',
  scope: 'openid profile email voucher',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  clearHashAfterLogin: true,
  showDebugInformation: true
};

export function createAuthZeroConfig(injector: Injector): AuthConfig {
  const href = injector.get(DOCUMENT).location.href;
  const origin = injector.get(DOCUMENT).location.origin;
  const appBaseHref = injector.get(APP_BASE_HREF);
  const configAuthZero: AuthConfig = {
    issuer: 'https://philly-vanilly.auth0.com/',
    customQueryParams: { audience: 'https://philly-vanilly.auth0.com/api/v2/' },
    redirectUri: href,
    silentRefreshRedirectUri: `${origin + appBaseHref}/silent-refresh.html`,
    clientId: 'r4gL1ntxR2lnodnu81WFnWNOWdO5SFuV',
    scope: 'openid profile email',
    clearHashAfterLogin: true,
    showDebugInformation: true
  };
  configAuthZero.logoutUrl =
    `${configAuthZero.issuer}v2/logout?client_id=${configAuthZero.clientId}&returnTo=${encodeURIComponent(configAuthZero.redirectUri)}`;
  return configAuthZero;
}

@Injectable({
  providedIn: 'root'
})
export class InitialAuthService {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  // tslint:disable-next-line:variable-name
  private _decodedAccessToken: any;
  // tslint:disable-next-line:variable-name
  private _decodedIDToken: any;
  get decodedAccessToken() { return this._decodedAccessToken; }
  get decodedIDToken() { return this._decodedIDToken; }

  constructor(
    private oauthService: OAuthService,
    // needed to get Router, Injection tokens etc before app initialization (and DOCUMENT when using AOT)
    private injector: Injector
  ) {}

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      // setup oauthService
      this.oauthService.configure(createAuthZeroConfig(this.injector));
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();

      // subscribe to token events
      this.oauthService.events
        .pipe(filter((e: any) => e.type === 'token_received'))
        .subscribe(() => this.handleNewToken());

      // continue initializing app (provoking a token_received event) or redirect to login-page
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
        if (isLoggedIn) {
          this.oauthService.setupAutomaticSilentRefresh();
          resolveFn();
          // if you don't use clearHashAfterLogin from angular-oauth2-oidc you can remove the #hash or route to some other URL manually:
          // const lazyPath = this.injector.get(LAZY_PATH) as string;
          // this.injector.get(Router).navigateByUrl(lazyPath + '/a') // remove login hash fragments from url
          //   .then(() => resolveFn()); // callback only once login state is resolved
        } else {
          this.oauthService.initImplicitFlow();
          rejectFn();
        }
      });
    });
  }

  private handleNewToken() {
    this._decodedAccessToken = this.jwtHelper.decodeToken(this.oauthService.getAccessToken());
    this._decodedIDToken = this.jwtHelper.decodeToken(this.oauthService.getIdToken());
  }
}
