import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftManagement } from './shift-management';

describe('ShiftManagement', () => {
  let component: ShiftManagement;
  let fixture: ComponentFixture<ShiftManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
