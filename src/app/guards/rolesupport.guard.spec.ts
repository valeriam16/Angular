import { TestBed } from '@angular/core/testing';

import { RolesupportGuard } from './rolesupport.guard';

describe('RolesupportGuard', () => {
  let guard: RolesupportGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RolesupportGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
