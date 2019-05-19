import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IcecreamshopsService } from 'src/app/services/icecreamshops.service';
import { NotificationService } from 'src/app/services/notification.service';

export enum FormModes {
  'CREATE',
  'UPDATE'
}

@Component({
  selector: 'app-icecreamshop-form',
  templateUrl: './icecreamshop-form.component.html',
  styleUrls: ['./icecreamshop-form.component.scss']
})
export class IcecreamshopFormComponent implements OnInit {

  @Input() mode = FormModes.CREATE;
  @Input() data = null;

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

  constructor(
    private icecreamshopsService: IcecreamshopsService,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    if (this.data) {
      this.setFieldsValues();
    }
  }

  setFieldsValues() {
    const {address, description, flavours, imageUrl, name} = this.data;
    const {city, street, longitude, latitude} = address;
    const fieldsValues = {name, description, imageUrl, city, street};
    const fieldsNames = ['name', 'description', 'imageUrl', 'city', 'street'];
    fieldsNames
      .forEach(
        (fieldName) => {
          this.icecreamshopForm.get(fieldName).setValue(fieldsValues[fieldName]);
        }
      );
    this.flavours = flavours;
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
    if (this.mode === FormModes.CREATE) {
      this.icecreamshopsService.addIcecreamShop(data).subscribe(
        (response) => {
          this.notificationService.show('Dodano pomyślnie');
          this.reset();
        },
        (error) => {
          this.notificationService.show(error);
        }
      );
    } else if (this.mode === FormModes.UPDATE) {
      this.icecreamshopsService.updateIcecreamShop(this.data._id, data).subscribe(
        (response) => {
          this.notificationService.show('Zaktualizowano pomyślnie');
        },
        (error) => {
          this.notificationService.show(error);
        }
      );
    }

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
