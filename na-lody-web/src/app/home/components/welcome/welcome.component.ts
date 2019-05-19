import { Component, OnInit, OnDestroy } from '@angular/core';
import { IcecreamshopsService } from 'src/app/services/icecreamshops.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IcecreamShop } from 'src/app/models/icecreamshop';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  currentIcecreamShop: IcecreamShop;
  sub: Subscription;

  constructor(private icecreamshopsService: IcecreamshopsService) { }

  ngOnInit() {
    this.getRandomIcecreamshop();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getRandomIcecreamshop() {
    this.icecreamshopsService.getAll()
      .subscribe( this.handleSubsciption() );
    this.sub = interval(10000)
      .pipe(
        switchMap(
          () => this.icecreamshopsService.getAll()
        )
      ).subscribe(
        this.handleSubsciption()
      );
  }

  handleSubsciption() {
    return (icecreamshops) => {
      const index = Math.floor(  Math.random() * icecreamshops.length );
      this.icecreamshopsService.getIcecreamShop(icecreamshops[index]._id).subscribe(
        (icecreamshop) => {
          this.currentIcecreamShop = icecreamshop;
        }
      );
    };
  }

}
