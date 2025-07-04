import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-finance-summary',
  templateUrl: './finance-summary.component.html',
  styleUrls: ['./finance-summary.component.css']
})
export class FinanceSummaryComponent implements OnInit {
  customerId: string | null = null;
  isBrowser: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.customerId = localStorage.getItem('customerId');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('customerId');
    this.router.navigate(['/login']);
  }

  goToInvoiceDetails() {
    this.router.navigate(['/invoice-details']);
  }

  goToPaymentsAndAging() {
    this.router.navigate(['/payments-and-aging']);
  }

  goToCreditDebitMemo() {
    this.router.navigate(['/credit-debit-memo']);
  }
}
