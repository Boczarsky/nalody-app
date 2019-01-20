import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IcecreamShop } from '../models/icecream-shop';
import { IcecreamShopsService } from '../services/icecream-shops.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  searchResult = new BehaviorSubject<IcecreamShop[]>([]);
  loading: Boolean = true;

  constructor(protected icsService: IcecreamShopsService) { }

  ngOnInit() {
    this.searchResult.subscribe(() => this.loading = false);
  }

  submit(value: String) {
    this.loading = true;
    value = value.trim();
    if (value.startsWith('#')) {
      this.icsService.getIcecreamShopsByCity(value.replace('#', '')).subscribe((data) => this.searchResult.next(data));
    } else {
      this.icsService.getIcecreamShopsByName(value).subscribe((data) => this.searchResult.next(data));
    }
  }

}
