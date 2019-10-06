import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree |
    Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        const isAuth = !!user;

        if (isAuth) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth']);
        }
      }));
  }
}
