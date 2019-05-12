import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LazyComponent} from './lazy.component';
import {RouterModule} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LazyComponent,
        children: [
          {
            path: 'a',
            loadChildren: './a/a.module#AModule'
          },
          {
            path: 'b',
            loadChildren: './b/b.module#BModule'
          }
        ]
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ]
})
export class LazyModule {
  constructor(
    private oauthService: OAuthService
  ) {
    if (!this.oauthService.hasValidAccessToken()) {
      throw new Error('No valid access token!');
    } else {
      console.log('Lazy Module loaded');
    }
  }
}
