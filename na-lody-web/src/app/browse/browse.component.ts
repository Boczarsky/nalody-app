import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IcecreamShop } from '../models/icecream-shop';
import { IcecreamShopsService } from '../services/icecream-shops.service';
import { Address } from '../models/address';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  loading: Boolean = true;

  icecreamShops: Observable<IcecreamShop[]>;

  constructor(protected icsService: IcecreamShopsService) { }

  ngOnInit() {
    this.icecreamShops = this.icsService.getAllIcecreamShops();
    this.icecreamShops.subscribe(() => this.loading = false);
  }

}
