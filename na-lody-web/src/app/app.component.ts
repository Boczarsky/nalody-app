import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentTheme = 'default';

  constructor(public overlayContainer: OverlayContainer){}

  name = 'Angular 7';
  @HostBinding('class') componentCssClass;

  changeTheme() {
    if (this.currentTheme === 'default') {
      this.currentTheme = 'unicorn-dark-theme';
    } else {
      this.currentTheme = 'default';
    }
    this.onSetTheme(this.currentTheme);
  }

  onSetTheme(theme) {
      this.overlayContainer.getContainerElement().classList.add(theme);
      this.componentCssClass = theme;
  }

  disableButton() {
    return window.location.pathname !== '/login';
  }

}
