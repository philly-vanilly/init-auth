import {Injectable, Injector} from '@angular/core';
import {AuthConfig, NullValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InitialAuthService {
  constructor(
    private authConfig: AuthConfig,
    private oauthService: OAuthService,
    private injector: Injector // needed to get Router before app initialization: https://github.com/robisim74/angular-l10n/issues/176
  ) {
  }

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new NullValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(res => {
        if (res) { // login success
          this.oauthService.setupAutomaticSilentRefresh();
          // remove login hash fragments from url
          // history.pushState('', document.title, window.location.pathname + window.location.search);
          this.injector.get(Router).navigateByUrl('sec').then(() => resolveFn());
          // resolveFn(); // callback only once login state is resolved
        } else {
          this.oauthService.initImplicitFlow();
          rejectFn();
        }
      });
    });
  }
}
