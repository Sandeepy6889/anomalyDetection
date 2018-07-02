import { TestBed, inject } from '@angular/core/testing';

import { AnomalyService } from './anomaly.service';

describe('AnomalyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnomalyService]
    });
  });

  it('should be created', inject([AnomalyService], (service: AnomalyService) => {
    expect(service).toBeTruthy();
  }));
});
