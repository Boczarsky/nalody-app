import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowseComponent } from './browse/browse.component';
import { ManageComponent } from './manage/manage.component';
import { DetailsComponent } from './browse/details/details.component';
import { ModifyComponent } from './manage/modify/modify.component';
import { AddNewComponent } from './manage/add-new/add-new.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'browse',
        pathMatch: 'full'
      },
      {
        path: 'browse',
        component: BrowseComponent
      },
      {
        path: 'manage',
        component: ManageComponent
      }
    ]
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'modify/:id',
    component: ModifyComponent
  },
  {
    path: 'new',
    component: AddNewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
