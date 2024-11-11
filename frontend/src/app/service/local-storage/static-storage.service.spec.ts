import { TestBed } from '@angular/core/testing';

import { StaticStorageService } from './static-storage.service';

describe('StaticStorageService', () => {
  let service: StaticStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
