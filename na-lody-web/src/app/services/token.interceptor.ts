import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (
      request.url.indexOf('/users/login') !== -1 ||
      request.url.indexOf('/users/register') !== -1
      ) {
      return next.handle(request);
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      return next.handle(request)
      .pipe(
        tap(
          (response) => {},
          (error) => {
            if (error.status === 401) {
              this.loginService.logout();
            }
          }
        )
      );
    }
  }

  constructor(private loginService: LoginService) { }
}
