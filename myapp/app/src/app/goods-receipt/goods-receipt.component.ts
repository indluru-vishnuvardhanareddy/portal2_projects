import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, NgIf, NgForOf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goods-receipt',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  grData: any[] = [];
  noData: boolean = false;
  isBrowser: boolean;
  vendorId: string | null = null;
  filters: any = {
  lifnr: '', mblnr: '', budat: '', bldat: '', usnam: '',
  zeile: '', bwart: '', ebeln: '', ebelp: '', matnr: '',
  werks: '', menge: '', meins: ''
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
        this.vendorId = storedVendorId.padStart(10, '0');
        this.fetchGRData(this.vendorId);
      } else {
        console.warn('No vendorId found in localStorage.');
        this.noData = true;
      }
    }
  }

  fetchGRData(vendorId: string): void {
    this.http.get<any>(`http://localhost:5000/api/goods-receipts/${vendorId}`).subscribe(
      (res) => {
        if (res?.success && res.data?.length > 0) {
          this.grData = res.data.map((item: any) => ({
            lifnr: item.Lifnr,
            mblnr: item.Mblnr,
            budat: item.Budat,
            bldat: item.Bldat,
            usnam: item.Usnam,
            zeile: item.Zeile,
            bwart: item.Bwart,
            ebeln: item.Ebeln,
            ebelp: item.Ebelp,
            matnr: item.Matnr,
            werks: item.Werks,
            menge: item.Menge,
            meins: item.Meins
          }));
          this.noData = false;
        } else {
          console.warn('Goods Receipt API responded with no data.');
          this.noData = true;
        }
      },
      (error) => {
        console.error('Goods Receipt fetch failed:', error);
        this.noData = true;
      }
    );
  }
 
  get filteredData() {
  return this.grData.filter(item =>
    Object.keys(this.filters).every(key => {
      const filterValue = this.filters[key].toString().toLowerCase().trim();
      const itemValue = (item[key] || '').toString().toLowerCase();
      return itemValue.includes(filterValue);
    })
  );
}

clearFilters() {
  Object.keys(this.filters).forEach(key => this.filters[key] = '');
}



  goBack(): void {
    this.router.navigate(['/procurement-process']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
