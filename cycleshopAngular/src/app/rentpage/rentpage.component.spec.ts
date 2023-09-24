import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentpageComponent } from './rentpage.component';

describe('RentpageComponent', () => {
  let component: RentpageComponent;
  let fixture: ComponentFixture<RentpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentpageComponent]
    });
    fixture = TestBed.createComponent(RentpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
