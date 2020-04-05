import { TestBed } from '@angular/core/testing';

import { ModelSocketService } from './model-socket.service';

describe('ModelSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelSocketService = TestBed.get(ModelSocketService);
    expect(service).toBeTruthy();
  });
});
