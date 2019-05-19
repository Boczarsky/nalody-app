import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  protected LOGIN_MODE_TITLE = 'Nie masz jeszcze konta?';
  protected REGISTER_MODE_TITLE = 'Masz już konto?';
  protected LOGIN = 'Logowanie';
  protected REGISTER = 'Rejestracja';

  public MODE = MODE;
  public currentMode = MODE.login;
  public currentTitle = this.LOGIN;
  public changeModeTitle = this.LOGIN_MODE_TITLE;

  constructor() { }

  changeMode() {
    if (this.currentMode === MODE.login) {
      this.currentMode = MODE.register;
      this.currentTitle = this.REGISTER;
      this.changeModeTitle = this.REGISTER_MODE_TITLE;
    } else {
      this.currentTitle = this.LOGIN;
      this.currentMode = MODE.login;
      this.changeModeTitle = this.LOGIN_MODE_TITLE;
    }
  }

}

export enum MODE {
  login,
  register
}
