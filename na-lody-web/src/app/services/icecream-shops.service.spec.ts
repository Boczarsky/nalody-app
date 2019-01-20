import { TestBed } from '@angular/core/testing';

import { IcecreamShopsService } from './icecream-shops.service';

describe('IcecreamShopsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IcecreamShopsService = TestBed.get(IcecreamShopsService);
    expect(service).toBeTruthy();
  });
});
