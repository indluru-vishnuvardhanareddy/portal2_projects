import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-procurement-process',
  templateUrl: './procurement-process.component.html',
  styleUrls: ['./procurement-process.component.css']
})
export class ProcurementProcessComponent implements OnInit {
  customerId: string | null = null;
  isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    if (this.isBrowser) {
      this.customerId = localStorage.getItem('customerId')
    }
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}
