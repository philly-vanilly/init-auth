import {InjectionToken, NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {HasValidTokenGuard} from './auth/has-valid-token-guard.service';

const lazyPathValue = 'lazy';
export const LAZY_PATH = new InjectionToken('LAZY_PATH');

@NgModule({
  imports: [
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
  providers: [{ provide: LAZY_PATH, useValue: lazyPathValue }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
