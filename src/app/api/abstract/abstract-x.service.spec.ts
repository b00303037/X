import { TestBed } from '@angular/core/testing';

import { AbstractXService } from './abstract-x.service';

describe('AbstractXService', () => {
  let service: AbstractXService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractXService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
