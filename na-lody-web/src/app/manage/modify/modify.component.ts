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
    additionalInfoControl: new FormControl('', [Validators.maxLength(255)])
  });

  modifyAddressForm = new FormGroup({
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
          additionalInfoControl: this.additionalInfo
        });
        this.modifyAddressForm.setValue({
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
      name: this.modifyIcecreamShopForm.get('nameControl').value,
      logoUrl: this.modifyIcecreamShopForm.get('logoUrlControl').value,
      additionalInfo: this.modifyIcecreamShopForm.get('additionalInfoControl').value
    };
    this.icsService.updateIcecreamShop(this.id, body).subscribe((data) => console.log(data), (err) => console.log(err));
  }

  modifyAddress() {
    const body = {
      city: this.modifyAddressForm.get('cityControl').value,
      street: this.modifyAddressForm.get('streetControl').value,
      latitude: this.modifyAddressForm.get('latitudeControl').value,
      longitude: this.modifyAddressForm.get('longitudeControl').value
    };
    this.icsService.updateAddressShop(this.id, body).subscribe((data) => console.log(data), (err) => console.log(err));
  }

  deleteIcecreamShop() {
    this.icsService.deleteIcecreamShop(this.id).subscribe((data) => data, (err) => {
      if (err.status === 201) {
        this.back();
      }
    });
  }

  pushFlavour(input) {
    this.icsService.addFlavour(this.id, input.value).subscribe((data) => data, (err) => {
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
