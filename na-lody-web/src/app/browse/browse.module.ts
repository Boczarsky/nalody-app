import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseComponent } from './browse.component';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [BrowseComponent, DetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
  ]
})
export class BrowseModule { }
