import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class HasValidTokenGuard implements CanLoad, CanActivate {
  constructor(
    private authService: OAuthService,
  ) {}

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.hasValidToken();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    return this.authService.hasValidAccessToken();
  }
}
