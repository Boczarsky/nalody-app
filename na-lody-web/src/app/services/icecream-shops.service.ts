import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IcecreamShop } from '../models/icecream-shop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IcecreamShopsService {

  private baseUrl = 'http://localhost:3000/icecreamshops';

  constructor(protected http: HttpClient) {}

  getAllIcecreamShops(): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + '?mode=all')
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  getIcecreamShop(id: Number) {
    return this.http.get<IcecreamShop>(this.baseUrl + `/${id}`)
    .pipe(map((data => new IcecreamShop(data))));
  }

  getIcecreamShopsByName(name: String): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + `?mode=name&name=${name}`)
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  getIcecreamShopsByCity(city: String): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + `?mode=city&name=${city}`)
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  updateIcecreamShop(id: Number, body) {
    return this.http.put(this.baseUrl + `/${id}`, body);
  }

  addIcecreamShop(body) {
    return this.http.post(this.baseUrl, body);
  }

  deleteIcecreamShop(id: Number) {
    return this.http.delete(this.baseUrl + `/${id}`);
  }

  addFlavour(id, flavour) {
    return this.http.post(this.baseUrl + `/${id}/flavours?value=${flavour}`, {});
  }

  deleteFlavour(id, flavour) {
    return this.http.delete(this.baseUrl + `/${id}/flavours?value=${flavour}`);
  }
}
