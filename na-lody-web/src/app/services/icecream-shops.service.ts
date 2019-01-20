import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IcecreamShop } from '../models/icecream-shop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IcecreamShopsService {

  private baseUrl = 'http://localhost:3000/nalodyapp/';

  constructor(protected http: HttpClient) {}

  getAllIcecreamShops(): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + 'icecreamshops?all=true')
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  getIcecreamShop(id: Number) {
    return this.http.get<IcecreamShop>(this.baseUrl + `icecreamshops/${id}`)
    .pipe(map((data => new IcecreamShop(data))));
  }

  getIcecreamShopsByName(name: String): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + `icecreamshops?name=${name}`)
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  getIcecreamShopsByCity(city: String): Observable<IcecreamShop[]> {
    return this.http.get<IcecreamShop[]>(this.baseUrl + `icecreamshops?city=${city}`)
    .pipe(map((res) => res.map((data) => new IcecreamShop(data)
    )));
  }

  updateIcecreamShop(id: Number, body) {
    return this.http.put(this.baseUrl + `icecreamshops/${id}?modify=icecreamshop`, body);
  }

  updateAddressShop(id: Number, body) {
    return this.http.put(this.baseUrl + `icecreamshops/${id}?modify=address`, body);
  }

  addIcecreamShop(body) {
    return this.http.post(this.baseUrl + 'icecreamshops', body);
  }

  deleteIcecreamShop(id: Number) {
    return this.http.delete(this.baseUrl + `icecreamshops/${id}`);
  }

  addFlavour(id, flavour) {
    return this.http.post(this.baseUrl + `icecreamshops/${id}/flavours?flavour=${flavour}`, {});
  }

  deleteFlavour(id, flavour) {
    return this.http.delete(this.baseUrl + `icecreamshops/${id}/flavours?flavour=${flavour}`, {});
  }
}
