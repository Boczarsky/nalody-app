import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormModes } from '../../../icecreamshop-form/icecreamshop-form.component';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<UpdateComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  public formModes = FormModes;

  ngOnInit() {
  }

}
