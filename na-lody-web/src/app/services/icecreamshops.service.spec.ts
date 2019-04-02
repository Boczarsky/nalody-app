import { TestBed } from '@angular/core/testing';

import { IcecreamshopsService } from './icecreamshops.service';

describe('IcecreamshopsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IcecreamshopsService = TestBed.get(IcecreamshopsService);
    expect(service).toBeTruthy();
  });
});
