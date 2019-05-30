import {APP_INITIALIZER, NgModule} from '@angular/core';
import {OAuthModule} from 'angular-oauth2-oidc';
import {InitialAuthService} from './initial-auth.service';

@NgModule({
  imports: [OAuthModule.forRoot()],
  providers: [
    InitialAuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (initialAuthService: InitialAuthService) => () => initialAuthService.initAuth(),
      deps: [InitialAuthService],
      multi: true
    },
  ],
})
export class AuthModule {}
