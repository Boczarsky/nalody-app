import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './home/components/welcome/welcome.component';
import { MyIcecreamshopsComponent } from './home/components/my-icecreamshops/my-icecreamshops.component';
import { AddIcecreamshopComponent } from './home/components/add-icecreamshop/add-icecreamshop.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      {
        path: '', component: WelcomeComponent
      },
      {
        path: 'moje', component: MyIcecreamshopsComponent
      },
      {
        path: 'dodaj', component: AddIcecreamshopComponent
      }
    ],
  },
  {
    path: 'login', component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
