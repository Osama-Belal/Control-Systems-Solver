import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouthComponent } from './routh.component';

describe('RouthComponent', () => {
  let component: RouthComponent;
  let fixture: ComponentFixture<RouthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
