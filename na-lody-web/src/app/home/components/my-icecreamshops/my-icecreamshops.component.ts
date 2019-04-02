import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-icecreamshops',
  templateUrl: './my-icecreamshops.component.html',
  styleUrls: ['./my-icecreamshops.component.scss']
})
export class MyIcecreamshopsComponent implements OnInit {

  editTooltip = 'Edytuj';
  previewTooltip  = 'Podgląd';

  data = [
    {_id: 1, name: 'Lodziarnia 1', address: {city: 'Miasto', street: 'Ulica 1'}},
    {_id: 2, name: 'Lodziarnia 2', address: {city: 'Miasto', street: 'Ulica 2'}},
    {_id: 3, name: 'Lodziarnia 3', address: {city: 'Miasto', street: 'Ulica 3'}},
    {_id: 4, name: 'Lodziarnia 4', address: {city: 'Miasto', street: 'Ulica 4'}},
    {_id: 5, name: 'Lodziarnia 5', address: {city: 'Miasto', street: 'Gen. Kociarbińskiego Bohatera Narodowego 110/5a'}},
  ];

  constructor() { }

  ngOnInit() {
  }

}
