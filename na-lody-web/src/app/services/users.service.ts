import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected URL = environment.apiURL + 'users/';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const requestUrl = URL + 'login';
    const body = {
      username,
      password
    };
    this.http.post(requestUrl, body).subscribe((response) => console.log(response));
  }

  register(username: string, password: string) {
    const requestUrl = URL + 'register';
    const body = {
      username,
      password
    };
    this.http.post(requestUrl, body).subscribe((response) => console.log(response));
  }
}
