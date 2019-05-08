import {Injectable, Injector} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {Router} from '@angular/router';
import {LAZY_PATH} from './injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class InitialAuthService {
  constructor(
    private authConfig: AuthConfig,
    private oauthService: OAuthService,
    // needed to get Router and Injection tokens before app initialization: https://github.com/robisim74/angular-l10n/issues/176
    private injector: Injector
  ) {
  }

  async initAuth(): Promise<any> {
    return new Promise((resolveFn, rejectFn) => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(isLoggedIn => {
        if (isLoggedIn) {
          this.oauthService.setupAutomaticSilentRefresh();
          const lazyPath = this.injector.get(LAZY_PATH) as string;
          this.injector.get(Router).navigateByUrl(lazyPath) // remove login hash fragments from url
            .then(() => resolveFn()); // callback only once login state is resolved
        } else {
          this.oauthService.initImplicitFlow();
          rejectFn();
        }
      });
    });
  }
}
