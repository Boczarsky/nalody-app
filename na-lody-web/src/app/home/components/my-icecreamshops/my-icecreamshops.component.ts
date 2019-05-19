import { Component, OnInit } from '@angular/core';
import { IcecreamshopsService } from 'src/app/services/icecreamshops.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material';
import { PreviewComponent } from './components/preview/preview.component';
import { UpdateComponent } from './components/update/update.component';

@Component({
  selector: 'app-my-icecreamshops',
  templateUrl: './my-icecreamshops.component.html',
  styleUrls: ['./my-icecreamshops.component.scss']
})
export class MyIcecreamshopsComponent implements OnInit {

  editTooltip = 'Edytuj';
  previewTooltip  = 'Podgląd';
  deleteTooltip  = 'Usuń';

  data;

  constructor(
    private icecreamshopsService: IcecreamshopsService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
    ) { }

  ngOnInit() {
    this.inicializeList();
  }

  inicializeList() {
    this.icecreamshopsService.getOwnedIcecreamShops()
    .subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        this.notificationService.show('Wystąpił błąd');
        this.data = [];
      }
    );
  }

  preview(id) {
    this.icecreamshopsService.getIcecreamShop(id).subscribe(
      (response) => {
        this.matDialog.open(PreviewComponent, {data: response});
      },
      (error) => {
        this.notificationService.show('Wystąpił błąd');
      }
    );
  }

  edit(id) {
    this.icecreamshopsService.getIcecreamShop(id).subscribe(
      (response) => {
        this.matDialog.open(UpdateComponent, {data: response});
      },
      (error) => {
        this.notificationService.show('Wystąpił błąd');
      }
    );
  }

  delete(id) {
    this.icecreamshopsService.deleteIcecreamShop(id).subscribe(
      (response) => {
        this.inicializeList();
      },
      (error) => {
        this.notificationService.show('Wystąpił błąd');
      }
    );
  }

  printReport() {
    this.icecreamshopsService.getReport().subscribe( (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

}
