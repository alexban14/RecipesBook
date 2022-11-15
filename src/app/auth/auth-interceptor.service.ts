import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  // this interceptor should add the token to all outgoing requests
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // "take" only one value form the observable and automatically unsubscribes
    // exhaustMap = waits for the first obs to complete, replaces the first one with a new one
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if(!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        })
        return next.handle(modifiedReq)
      }))

  }
}
