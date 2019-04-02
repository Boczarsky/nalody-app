import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIcecreamshopComponent } from './add-icecreamshop.component';

describe('AddIcecreamshopsComponent', () => {
  let component: AddIcecreamshopComponent;
  let fixture: ComponentFixture<AddIcecreamshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIcecreamshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIcecreamshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
