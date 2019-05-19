import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  protected URL = environment.apiURL + '/users/';

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    const requestUrl = this.URL + 'login';
    const body = {
      username,
      password
    };
    return this.http.post(requestUrl, body);
  }

  register(username: string, password: string) {
    const requestUrl = this.URL + 'register';
    const body = {
      username,
      password
    };
    return this.http.post(requestUrl, body);
  }
}
