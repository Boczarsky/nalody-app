import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/models/address';
import { IcecreamShopsService } from 'src/app/services/icecream-shops.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent implements OnInit {

  id: Number;
  name: String;
  logoUrl: String;
  additionalInfo: String;
  address: Address;
  flavours: String[];
  loading: Boolean = true;

  modifyIcecreamShopForm = new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
    logoUrlControl: new FormControl('', [Validators.maxLength(255)]),
    additionalInfoControl: new FormControl('', [Validators.maxLength(255)]),
    cityControl: new FormControl('', [Validators.required]),
    streetControl: new FormControl('', [Validators.required]),
    latitudeControl: new FormControl('', [Validators.required]),
    longitudeControl: new FormControl('', [Validators.required])
  });

  constructor(protected route: ActivatedRoute, protected icsService: IcecreamShopsService, protected location: Location) { }

  ngOnInit() {
    this.route.params.subscribe((value) => {
      this.icsService.getIcecreamShop(value.id).subscribe((data) => {
        this.id = value.id;
        this.name = data.name;
        this.logoUrl = data.logoUrl;
        this.additionalInfo = data.additionalInfo;
        this.address = data.address;
        this.flavours = data.flavours;
        this.loading = false;
        this.modifyIcecreamShopForm.setValue({
          nameControl: this.name,
          logoUrlControl: this.logoUrl,
          additionalInfoControl: this.additionalInfo,
          cityControl: this.address.city,
          streetControl: this.address.street,
          latitudeControl: this.address.latitude,
          longitudeControl: this.address.longitude
        });
      });
    });
  }

  back() {
    this.location.back();
  }

  modifyIcecreamShop() {
    const body = {
      id: parseInt(this.id.toString(), 10),
      name: this.modifyIcecreamShopForm.get('nameControl').value,
      logoUrl: this.modifyIcecreamShopForm.get('logoUrlControl').value,
      additionalInfo: this.modifyIcecreamShopForm.get('additionalInfoControl').value,
      address: {
        city: this.modifyIcecreamShopForm.get('cityControl').value,
        street: this.modifyIcecreamShopForm.get('streetControl').value,
        latitude: parseFloat(this.modifyIcecreamShopForm.get('latitudeControl').value),
        longitude: parseFloat(this.modifyIcecreamShopForm.get('longitudeControl').value)
      },
      flavours: this.flavours
    };
    this.icsService.updateIcecreamShop(this.id, body).subscribe((data) => data, (err) => console.log(err));
  }

  deleteIcecreamShop() {
    this.icsService.deleteIcecreamShop(this.id).subscribe((data) => {
      this.back();
    });
  }

  pushFlavour(input) {
    this.icsService.addFlavour(this.id, input.value).subscribe((data) => {
      this.flavours.push(input.value);
      input.value = '';
    });
  }

  deleteFlavour(flavour) {
    this.icsService.deleteFlavour(this.id, flavour).subscribe((data) => {
      const index = this.flavours.indexOf(flavour);
      this.flavours.splice(index, 1);
    });
  }

}
