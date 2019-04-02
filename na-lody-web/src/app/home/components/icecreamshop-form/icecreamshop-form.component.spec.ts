import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcecreamshopFormComponent } from './icecreamshop-form.component';

describe('IcecreamshopFormComponent', () => {
  let component: IcecreamshopFormComponent;
  let fixture: ComponentFixture<IcecreamshopFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcecreamshopFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcecreamshopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
