import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { IcecreamShopsService } from 'src/app/services/icecream-shops.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.css']
})
export class AddNewComponent implements OnInit {

  flavours: String[] = [];

  addIcecreamShopForm = new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
    logoUrlControl: new FormControl('', [Validators.maxLength(255)]),
    additionalInfoControl: new FormControl('', [Validators.maxLength(255)]),
    cityControl: new FormControl('', [Validators.required]),
    streetControl: new FormControl('', [Validators.required]),
    latitudeControl: new FormControl('', [Validators.required]),
    longitudeControl: new FormControl('', [Validators.required])
  });

  constructor(protected location: Location, protected icsService: IcecreamShopsService) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

  pushFlavour(input) {
    this.flavours.push(input.value);
    input.value = '';
  }

  delete(flavour) {
    const index = this.flavours.indexOf(flavour);
    this.flavours.splice(index, 1);
  }

  addIcecreamShop() {
    const body = {
      name: this.addIcecreamShopForm.get('nameControl').value,
      logoUrl: this.addIcecreamShopForm.get('logoUrlControl').value,
      additionalInfo: this.addIcecreamShopForm.get('additionalInfoControl').value,
      address: {
        city: this.addIcecreamShopForm.get('cityControl').value,
        street: this.addIcecreamShopForm.get('streetControl').value,
        latitude: this.addIcecreamShopForm.get('latitudeControl').value,
        longitude: this.addIcecreamShopForm.get('longitudeControl').value
      },
      flavours: this.flavours
    };
    this.icsService.addIcecreamShop(body).subscribe((data) => this.back() );
  }

}
