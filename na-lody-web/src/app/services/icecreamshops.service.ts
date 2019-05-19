import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IcecreamShop } from '../models/icecreamshop';

@Injectable({
  providedIn: 'root'
})
export class IcecreamshopsService {

  private URL = environment.apiURL + '/icecreamshops/';

  constructor(private http: HttpClient) { }

  getOwnedIcecreamShops() {
    const requestUrl = this.URL + 'owned';
    return this.http.get(requestUrl);
  }

  addIcecreamShop(icecreamShopData) {
    return this.http.post(this.URL, icecreamShopData);
  }

  updateIcecreamShop(id, icecreamShopData) {
    const requestUrl = this.URL + id;
    return this.http.put(requestUrl, icecreamShopData);
  }

  deleteIcecreamShop(id) {
    const requestUrl = this.URL + id;
    return this.http.delete(requestUrl);
  }

  getIcecreamShop(id) {
    const requestUrl = this.URL + id;
    return this.http.get<IcecreamShop>(requestUrl);
  }

  getReport() {
    const requestUrl = this.URL + 'report';
    return this.http.get(requestUrl, {responseType: 'blob'});
  }

  getAll() {
    const requestUrl = this.URL;
    return this.http.get<any[]>(requestUrl);
  }

}
