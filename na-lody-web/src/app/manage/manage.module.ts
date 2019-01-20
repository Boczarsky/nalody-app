import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { ModifyComponent } from './modify/modify.component';
import { AddNewComponent } from './add-new/add-new.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ManageComponent, ModifyComponent, AddNewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ManageModule { }
