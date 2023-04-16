import { TestBed } from '@angular/core/testing';

import { RouthService } from './Service/routh.service';

describe('RouthService', () => {
  let service: RouthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
