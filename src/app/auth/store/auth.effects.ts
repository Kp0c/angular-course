import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(environment.url + 'accounts:signUp?key=' + environment.apiKey, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
        }
      ).pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => this.handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(this.handleError)
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(environment.url + 'accounts:signInWithPassword?key=' + environment.apiKey, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }
      ).pipe(
        tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => this.handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(this.handleError)
      );
    }));

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData || !userData._token) {
          return { type: 'DUMMY' };
        }

        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);

        return new AuthActions.AuthenticateSuccess({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expirationDate: userData._tokenExpirationDate,
          redirect: false
        });
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';

    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'The email exists already';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'The email doesn\'t found';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid or the user does not have a password';
          break;
        case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
            break;
      }
    }

    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  private handleAuthentication(expiresIn: number, email: string, userId: string, token: string) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
        redirect: true
      });
  }
}
