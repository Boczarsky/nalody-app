import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackbar: MatSnackBar) { }

  show(message: string) {
    this.snackbar.open(message, null, {duration: 1500});
  }
}
