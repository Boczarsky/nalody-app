import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  checkDisabled(elementRef) {
    return elementRef._elementRef.nativeElement.classList.contains('button-disabled');
  }

  logout() {
    this.loginService.logout();
  }

}
