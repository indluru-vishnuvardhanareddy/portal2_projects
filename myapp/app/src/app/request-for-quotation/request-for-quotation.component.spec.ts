import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForQuotationComponent } from './request-for-quotation.component';

describe('RequestForQuotationComponent', () => {
  let component: RequestForQuotationComponent;
  let fixture: ComponentFixture<RequestForQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestForQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
