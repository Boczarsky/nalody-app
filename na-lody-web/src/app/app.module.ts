import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login/components/login-form/login-form.component';
import { RegisterFormComponent } from './login/components/register-form/register-form.component';
import { WelcomeComponent } from './home/components/welcome/welcome.component';
import { MyIcecreamshopsComponent } from './home/components/my-icecreamshops/my-icecreamshops.component';
import { AddIcecreamshopComponent } from './home/components/add-icecreamshop/add-icecreamshop.component';
import { IcecreamshopFormComponent } from './home/components/icecreamshop-form/icecreamshop-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginFormComponent,
    RegisterFormComponent,
    WelcomeComponent,
    MyIcecreamshopsComponent,
    AddIcecreamshopComponent,
    IcecreamshopFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
