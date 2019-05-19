import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  protected loginStatus$: BehaviorSubject<boolean>;

  constructor(
    protected usersService: UsersService,
    protected router: Router,
    protected notificationService: NotificationService
    ) {
    if (localStorage.getItem('access-token')) {
      this.loginStatus$ = new BehaviorSubject(true);
    } else {
      this.loginStatus$ = new BehaviorSubject(false);
    }
    this.loginStatus$.subscribe( (loggedIn) => {
      if (!loggedIn) {
        router.navigate(['/login']);
      }
    });
  }

  login(username, password) {
    this.usersService.login(username, password).subscribe(
      (response) => {
        localStorage.setItem('access-token', response['access-token']);
        this.loginStatus$.next(true);
        this.router.navigate(['/']);
        this.notificationService.show('Pomyślnie zalogowano.');
      },
      (error) => {
        this.notificationService.show('Niepoprawne dane logowania.');
      });
  }

  logout() {
    localStorage.removeItem('access-token');
    this.loginStatus$.next(false);
    this.notificationService.show('Wylogowano.');
  }

  getLoginStatus() {
    return this.loginStatus$;
  }
}
