import { TestBed } from '@angular/core/testing';

import { SignalGraphService } from './Service/signal-graph.service';

describe('SignalGraphService', () => {
  let service: SignalGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
