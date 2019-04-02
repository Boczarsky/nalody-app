import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  protected LOGIN_MODE_TITLE = 'Nie masz jeszcze konta?';
  protected REGISTER_MODE_TITLE = 'Masz już konto?';

  public MODE = MODE;
  public currentMode = MODE.login;
  public changeModeTitle = this.LOGIN_MODE_TITLE;

  constructor() { }

  changeMode() {
    if (this.currentMode === MODE.login) {
      this.currentMode = MODE.register;
      this.changeModeTitle = this.REGISTER_MODE_TITLE;
    } else {
      this.currentMode = MODE.login;
      this.changeModeTitle = this.LOGIN_MODE_TITLE;
    }
  }

}

export enum MODE {
  login,
  register
}
