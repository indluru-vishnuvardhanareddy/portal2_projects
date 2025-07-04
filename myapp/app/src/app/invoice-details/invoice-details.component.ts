import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceData: any[] = [];
  noData: boolean = false;
  isBrowser: boolean;
  vendorId: string | null = null;
  storedVendorId: string | null = null;
  filters: any = {
  belnr: '', lifnr: '', bldat: '', bukrs: '',
  matnr: '', wrbtr: '', waers: '', ebeln: '',
  menge: '', meins: '', eindt: ''
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
      this.storedVendorId = localStorage.getItem('vendorId');
      if (this.storedVendorId) {
        // Pad vendorId to 10 digits with leading zeros if needed
        while (this.storedVendorId.length < 10) {
          this.storedVendorId = '0' + this.storedVendorId;
        }
        this.vendorId = this.storedVendorId;
        this.fetchInvoiceData(this.storedVendorId);
      } else {
        console.warn('No vendorId found in localStorage.');
      }
    }
  }

  fetchInvoiceData(vendorId: string): void {
    const apiUrl = `http://localhost:5000/api/invoices/${vendorId}`;

    this.http.get<{ success: boolean; data: any[] }>(apiUrl).subscribe(
      (res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.invoiceData = res.data.map((item: any) => ({
            lifnr: item.Lifnr ?? '',
            belnr: item.Belnr ?? '',
            bldat: item.Bldat ?? '',
            bukrs: item.Bukrs ?? '',
            matnr: item.Matnr ?? '',
            wrbtr: item.Wrbtr ?? '',
            waers: item.Waers ?? '',
            ebeln: item.Ebeln ?? '',
            menge: item.Menge ?? '',
            meins: item.Meins ?? '',
            eindt: item.Eindt ?? ''
          }));
          this.noData = false;
        } else {
          this.invoiceData = [];
          this.noData = true;
        }
      },
      (error: any) => {
        console.error('Invoice fetch failed:', error);
        this.invoiceData = [];
      }
    );
  }

get filteredData() {
  return this.invoiceData.filter(item =>
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

// Inside your class:
downloadPDF(belnr: string): void {
  const url = `http://localhost:5000/api/invoice-pdf/${belnr}`;

  this.http.get(url, { responseType: 'blob' }).subscribe(
    (response: Blob) => {
      const filename = `Invoice_${belnr}.pdf`;
      saveAs(response, filename);
    },
    (error) => {
      console.error('Failed to download invoice PDF:', error);
      alert('Unable to download invoice. Please try again.');
    }
  );
}


  goBack(): void {
    this.router.navigate(['/finance-summary']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
