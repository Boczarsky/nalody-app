import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  path = Path;

  constructor() { }

  ngOnInit() {
  }

  isActive(path: Path) {
    switch (path) {
      case Path.browse:
        if (window.location.pathname === '/browse') {
          return false;
        } else {
          return true;
        }
      case Path.manage:
        if (window.location.pathname === '/manage') {
          return false;
        } else {
          return true;
        }
    }
  }

}

enum Path {
  browse = 'browse',
  manage = 'manage'
}
