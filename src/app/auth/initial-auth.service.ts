import {Injectable} from '@angular/core';
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
  get decodedAccessToken() { return this._decodedAccessToken; }

  // tslint:disable-next-line:variable-name
  private _decodedIDToken: any;
  get decodedIDToken() { return this._decodedIDToken; }

  constructor(
    private authConfig: AuthConfig,
    private oauthService: OAuthService,
    // needed to get Router and Injection tokens before app initialization: https://github.com/robisim74/angular-l10n/issues/176
    // private injector: Injector
  ) {}

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.initTokenReceivedHandler();
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

  private initTokenReceivedHandler() {
    this.oauthService.events
      .pipe(filter((e: any) => e.type === 'token_received'))
      .subscribe(() => this.handleNewToken());
  }
}
