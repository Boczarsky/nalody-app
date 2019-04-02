import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-icecreamshop-form',
  templateUrl: './icecreamshop-form.component.html',
  styleUrls: ['./icecreamshop-form.component.scss']
})
export class IcecreamshopFormComponent implements OnInit {

  @ViewChild('form') form;

  namePlaceholder = 'Nazwa lodziarni';
  descriptionPlaceholder = 'Opis';
  imageUrlPlaceholder = 'Url loga';
  cityPlaceholder = 'Miasto';
  streetPlaceholder = 'Ulica';
  flavourPlaceholder = 'Dodaj smak';
  applyPlaceholder = 'Zatwierdź';
  addFlavourPlaceholder = 'Dodaj';
  deleteFlavourTooltip = 'Usuń';

  icecreamshopForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    imageUrl: new FormControl(''),
    city: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required)
  });
  flavourControl = new FormControl('', Validators.required);

  flavours = [];

  constructor() { }

  ngOnInit() {
  }

  addFlavour() {
    const flavour = this.flavourControl.value.trim();
    if (flavour) {
      this.flavourControl.reset();
      if (!this.checkIfExist(flavour)) {
        this.flavours.unshift(flavour);
      }
    }
  }

  apply() {
    const { name, description, imageUrl, city, street } = this.icecreamshopForm.value;
    const data = {
      name,
      description,
      imageUrl,
      address: {
        city,
        street,
        longitude: 0,
        latitude: 0,
      },
      flavours: this.flavours
    };
    this.reset();
  }

  checkIfExist(flavour) {
    return this.flavours.indexOf(flavour) !== -1;
  }

  deleteFlavour(item) {
    const index = this.flavours.indexOf(item);
    if (index !== -1) {
      this.flavours.splice(index, 1);
      this.flavourControl.reset();
    }
  }

  reset() {
    this.flavours = [];
    this.form.resetForm();
    this.flavourControl.reset();
  }

}
