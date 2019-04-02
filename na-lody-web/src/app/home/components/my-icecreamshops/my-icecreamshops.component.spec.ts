import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIcecreamshopsComponent } from './my-icecreamshops.component';

describe('MyIcecreamshopsComponent', () => {
  let component: MyIcecreamshopsComponent;
  let fixture: ComponentFixture<MyIcecreamshopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIcecreamshopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIcecreamshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
