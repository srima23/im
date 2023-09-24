import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestockpageComponent } from './restockpage.component';

describe('RestockpageComponent', () => {
  let component: RestockpageComponent;
  let fixture: ComponentFixture<RestockpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestockpageComponent]
    });
    fixture = TestBed.createComponent(RestockpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
