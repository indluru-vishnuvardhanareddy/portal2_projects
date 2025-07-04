import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser, CommonModule, NgIf, NgForOf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  poData: any[] = [];
  isBrowser: boolean;
  vendorId: string | null = null;
  filters: any = {
  ebeln: '', lifnr: '', bsart: '', bedat: '', ekorg: '',
  ekgrp: '', ebelp: '', matnr: '', txz01: '', menge: '',
  meins: '', netpr: '', peinh: '', wrbtr: '', waers: '', eindt: ''
};


  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('Constructor');
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const storedVendorId = localStorage.getItem('vendorId');
      if (storedVendorId) {
        this.vendorId = storedVendorId.padStart(10, '0');
        this.fetchPOData(this.vendorId);
      } else {
        console.warn('No vendorId found in localStorage.');
      }
    }
  }

  fetchPOData(vendorId: string): void {
    this.http.get<any>(`http://localhost:5000/api/purchase-orders/${vendorId}`).subscribe(
      (res) => {
        if (res?.success && res.data) {
          this.poData = res.data.map((item: any) => ({
            ebeln: item.Ebeln,
            lifnr: item.Lifnr,
            bsart: item.Bsart,
            bedat: new Date(parseInt(item.Bedat.match(/\d+/)[0], 10)),
            ekorg: item.Ekorg,
            ekgrp: item.Ekgrp,
            ebelp: item.Ebelp,
            matnr: item.Matnr,
            txz01: item.Txz01,
            menge: item.Menge,
            meins: item.Meins,
            netpr: item.Netpr,
            peinh: item.Peinh,
            wrbtr: item.Wrbtr,
            waers: item.Waers,
            eindt: new Date(parseInt(item.Eindt.match(/\d+/)[0], 10))
          }));
          console.log('PO Data:', this.poData);
        } else {
          console.warn('PO API responded with no data.');
        }
      },
      (error) => {
        console.error('PO fetch failed:', error);
      }
    );
  }
get filteredData() {
  return this.poData.filter(item =>
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
