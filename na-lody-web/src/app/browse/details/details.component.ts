import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IcecreamShopsService } from 'src/app/services/icecream-shops.service';
import { Address } from 'src/app/models/address';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  name: String;
  logoUrl: String;
  additionalInfo: String;
  address: Address;
  flavours: String[];
  loading: Boolean = true;

  constructor(protected route: ActivatedRoute, protected icsService: IcecreamShopsService, protected location: Location) { }

  ngOnInit() {
    this.route.params.subscribe((value) => {
      this.icsService.getIcecreamShop(value.id).subscribe((data) => {
        this.name = data.name;
        this.logoUrl = data.logoUrl;
        this.additionalInfo = data.additionalInfo;
        this.address = data.address;
        this.flavours = data.flavours;
        this.loading = false;
      });
    });
  }

  back() {
    this.location.back();
  }

}
