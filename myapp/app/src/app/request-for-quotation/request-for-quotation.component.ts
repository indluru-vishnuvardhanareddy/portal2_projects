import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser, CommonModule, NgIf, NgForOf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-request-for-quotation',
  standalone: true,
  imports: [
    CommonModule,      // for ngIf, ngFor etc.
    HttpClientModule,  // for HttpClient
    RouterModule, 
    FormsModule,     // for Router and routerLink if needed
    NgIf,
    NgForOf
  ],
  templateUrl: './request-for-quotation.component.html',
  styleUrls: ['./request-for-quotation.component.css']
})
export class RequestForQuotationComponent implements OnInit {
  rfqData: any[] = [];
  isBrowser: boolean;
  vendorId: string | null = null;
  filters: any = {
  ebeln: '', lifnr: '', bedat: '', ekorg: '',
  bsart: '', matnr: '', netpr: '', menge: '', meins: '', eindt: ''
};


  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('Cosnstructor')
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const storedVendorId = localStorage.getItem('vendorId');
      if (storedVendorId) {
        this.vendorId = storedVendorId.padStart(10, '0');
        this.fetchRFQData(this.vendorId);
      } else {
        console.warn('No vendorId found in localStorage.');
      }
    }
  }

  fetchRFQData(vendorId: string): void {
    this.http.get<any>(`http://localhost:5000/api/rfq/${vendorId}`).subscribe(
      (res) => {
        if (res?.success && res.data) {
          this.rfqData = res.data.map((item: any) => ({
            ebeln: item.Ebeln,
            lifnr: item.Lifnr,
            bedat: new Date(parseInt(item.Bedat.match(/\d+/)[0], 10)),
            ekorg: item.Ekorg,
            bsart: item.Bsart,
            matnr: item.Matnr,
            netpr: item.Netpr,
            peinh: item.Peinh,
            eindt: new Date(parseInt(item.Eindt.match(/\d+/)[0], 10)),
            menge: item.Menge,
            meins: item.Meins
          }));
          console.log('RFQ Data:', this.rfqData);
        } else {
          console.warn('RFQ API responded with no data.');
        }
      },
      (error) => {
        console.error('RFQ fetch failed:', error);
      }
    );
  }

get filteredData() {
  return this.rfqData.filter(item =>
    Object.keys(this.filters).every(key => {
      const filterValue = this.filters[key].trim().toLowerCase();
      const itemValue = (item[key] || '').toString().trim().toLowerCase();
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
