import {Injectable, Injector, isDevMode} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {JwtHelperService} from '@auth0/angular-jwt';
import {filter} from 'rxjs/operators';

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
    private authConfig: AuthConfig
  ) {}

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      // setup oauthService
      this.oauthService.configure(this.authConfig);
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
