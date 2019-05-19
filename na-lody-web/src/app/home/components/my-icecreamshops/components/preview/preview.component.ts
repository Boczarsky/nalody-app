import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<PreviewComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

}
