import { TestBed, inject } from '@angular/core/testing';

import { MindsdkService } from './mindsdk.service';

describe('MindsdkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MindsdkService]
    });
  });

  it('should be created', inject([MindsdkService], (service: MindsdkService) => {
    expect(service).toBeTruthy();
  }));
});
