import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
// one big observable that gives access to all dispatch actions
import * as AuthActions from './auth.actions'

export interface AuthResponseData {
	idToken: string,
	email: string,
	refreshToken: string,
	expiresIn: string,
	localId: string,
	registred?: string
  }

@Injectable()
// so things can be injected into AuthEffects
export class AuthEffects {
	APIkey = environment.firebaseAPIKey;
   	signUpURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.APIkey;
   	loginURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.APIkey;

	constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}

	#handleAuthentication(email, userId, token: string, expiresIn: number) {
		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
		return new AuthActions.AuthenticateSuccess({
			email: email,
			userId: userId,
			token: token,
			expirationDate: expirationDate
		});
	};

	#handleError(errorRes: any) {
		let errorMessage = 'An unknown error occurred!';
		if(!errorRes.error || !errorRes.error.error) {
			return of(new AuthActions.AuthenticateFail(errorMessage));
		}
		switch(errorRes.error.error.message){
			case 'EMAIL_EXISTS':
			errorMessage = 'This email exists already!';
			break;
			case 'EMAIL_NOT_FOUND':
			errorMessage = 'This email does not exist!';
			break;
			case 'INVALID_PASSWORD':
			errorMessage = 'Wrong password!';
			break;
		}
		// utility function to create a new observable
		return of(new AuthActions.AuthenticateFail(errorMessage));
	};

	@Effect()
	authSingUp = this.actions$.pipe(
		ofType(AuthActions.SIGNUP_START),
		switchMap((signupAction: AuthActions.SignupStart) => {
			return this.http.post<AuthResponseData>(
				this.signUpURL,
				{
				  email: signupAction.payload.email,
				  password: signupAction.payload.password,
				  returnSecureToken: true
				}
			).pipe(map(resData => {
				return this.#handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
			  }),
				catchError(errorRes => {
				return this.#handleError(errorRes)
			  })
			);
		})
	)

	@Effect()
	authLogin = this.actions$.pipe(
		ofType(AuthActions.LOGIN_START),
		switchMap((authData: AuthActions.LoginStart) => {
			return this.http.post<AuthResponseData>(
				this.loginURL,
				{
				  email: authData.payload.email,
				  password: authData.payload.password,
				  returnSecureToken: true
				}
			  )
			  .pipe(map(resData => {
				return this.#handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
			  }),
				catchError(errorRes => {
					return this.#handleError(errorRes)
				})
			);
		}),
	);

	// we tell ngrx that we dont dispatch a new action at the end
	@Effect({dispatch: false})
	authRedirect = this.actions$.pipe(
		ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
		tap(() => {
			this.router.navigate(['/']);
		})
	);
}