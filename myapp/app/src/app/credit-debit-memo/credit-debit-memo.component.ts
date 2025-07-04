import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credit-debit-memo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-debit-memo.component.html',
  styleUrls: ['./credit-debit-memo.component.css']
})
export class CreditDebitMemoComponent implements OnInit {
  memoData: any[] = [];
  noData: boolean = false;
  isBrowser: boolean;
  vendorId: string | null = null;
  filters: any = {
  belnr: '', blart: '', wrbtr: '', waers: '', ebeln: '', matnr: '',
  bukrs: '', bldat: '', budat: '', gjahr: '', buzei: '',
  shkzg: '', usnam: '', augbl: ''
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
        this.fetchMemoData(paddedVendorId);
      }
    }
  }

  fetchMemoData(vendorId: string): void {
    const apiUrl = `http://localhost:5000/api/credit-debit-memos/${vendorId}`;

    this.http.get<{ success: boolean; data: any[] }>(apiUrl).subscribe(
      (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.memoData = res.data.map((item: any) => ({
            lifnr: item.Lifnr ?? '',
            wrbtr: item.Wrbtr ?? '',
            waers: item.Waers ?? '',
            matnr: item.Matnr ?? '',
            ebeln: item.Ebeln ?? '',
            blart: item.Blart ?? '',
            bldat: item.Bldat ?? '',
            bukrs: item.Bukrs ?? '',
            shkzg: item.Shkzg ?? '',
            belnr: item.Belnr ?? '',
            gjahr: item.Gjahr ?? '',
            buzei: item.Buzei ?? '',
            budat: item.Budat ?? '',
            usnam: item.Usnam ?? '',
            augbl: item.Augbl ?? ''
          }));
          this.noData = false;
        } else {
          this.memoData = [];
          this.noData = true;
        }
      },
      (error) => {
        console.error('Memo fetch error:', error);
        this.memoData = [];
        this.noData = true;
      }
    );
  }

  get filteredData() {
  return this.memoData.filter(item =>
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
