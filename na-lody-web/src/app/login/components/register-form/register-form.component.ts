import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { NotificationService } from 'src/app/services/notification.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  @ViewChild('form') formRef;

  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(protected usersService: UsersService, protected notificationService: NotificationService) {
    this.registerForm.get('username').valueChanges.subscribe( (value) => {
      if (value) {
        this.registerForm.get('username').setValue(value.trim(), {emitEvent: false});
      }
    });
    this.registerForm.get('password').valueChanges.subscribe( (value) => {
      if (value) {
        this.registerForm.get('password').setValue(value.trim(), {emitEvent: false});
      }
    });
  }

  ngOnInit() {
  }

  register() {
    this.usersService.register(
      this.registerForm.get('username').value,
      this.registerForm.get('password').value)
      .subscribe(
        (response) => {
          this.formRef.resetForm();
          this.notificationService.show('Pomyślnie zarejestrowano.');
        },
        (error) => {
          this.notificationService.show('Nie udało się zarejestrować.');
        }
          );
  }

}
