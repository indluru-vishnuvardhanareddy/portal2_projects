import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-payments-and-aging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments-and-aging.component.html',
  styleUrls: ['./payments-and-aging.component.css']
})
export class PaymentsAndAgingComponent implements OnInit {
  paymentData: any[] = [];
  noData: boolean = false;
  isBrowser: boolean;
  vendorId: string | null = null;
  filters: any = {
  belnr: '', blart: '', wrbtr: '', waers: '', bukrs: '',
  bldat: '', budat: '', gjahr: '', buzei: '', usnam: '',
  augbl: '', zterm: '', rebzg: '', aging: ''
};

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const storedVendorId = localStorage.getItem('vendorId');
      if (storedVendorId) {
        const paddedVendorId = storedVendorId.padStart(10, '0');
        this.vendorId = paddedVendorId;
        this.fetchPaymentData(paddedVendorId);
      }
    }
  }

  fetchPaymentData(vendorId: string): void {
    const apiUrl = `http://localhost:5000/api/payments-aging/${vendorId}`;

    this.http.get<{ success: boolean; data: any[] }>(apiUrl).subscribe(
      (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.paymentData = res.data.map((item: any) => ({
            belnr: item.Belnr ?? '',
            blart: item.Blart ?? '',
            wrbtr: item.Wrbtr ?? '',
            waers: item.Waers ?? '',
            bukrs: item.Bukrs ?? '',
            bldat: item.Bldat ?? '',
            budat: item.Budat ?? '',
            gjahr: item.Gjahr ?? '',
            buzei: item.Buzei ?? '',
            usnam: item.Usnam ?? '',
            augbl: item.Augbl ?? '',
            zterm: item.Zterm ?? '',
            rebzg: item.Rebzg ?? '',
            aging: item.Aging ?? ''
          }));
          this.noData = false;
        } else {
          this.paymentData = [];
          this.noData = true;
        }
      },
      (error) => {
        console.error('Payments fetch error:', error);
        this.paymentData = [];
        this.noData = true;
      }
    );
  }

  get filteredData() {
  return this.paymentData.filter(item =>
    Object.keys(this.filters).every(key => {
      const filterVal = this.filters[key].toString().toLowerCase().trim();
      const itemVal = (item[key] || '').toString().toLowerCase();
      return itemVal.includes(filterVal);
    })
  );
}

clearFilters(): void {
  Object.keys(this.filters).forEach(key => (this.filters[key] = ''));
}

  goBack(): void {
    this.router.navigate(['/finance-summary']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
