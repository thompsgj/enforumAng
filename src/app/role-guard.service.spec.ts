import { TestBed, inject } from '@angular/core/testing';

import { RoleGuardServiceService } from './role-guard-service.service';

describe('RoleGuardServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleGuardServiceService]
    });
  });

  it('should be created', inject([RoleGuardServiceService], (service: RoleGuardServiceService) => {
    expect(service).toBeTruthy();
  }));
});
