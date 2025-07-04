import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, HttpClientModule]
})
export class DashboardComponent implements OnInit {
  vendorId: string | null = null;
  loginTime: string | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Check if user is logged in
      this.vendorId = localStorage.getItem('vendorId');
      this.loginTime = localStorage.getItem('loginTime');
      
      if (!this.vendorId) {
        this.router.navigate(['/login']);
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear(); // Clear all stored data
    }
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToProcurement() {
    this.router.navigate(['/procurement-process']);
  }

  goToFinance() {
    this.router.navigate(['/finance-summary']);
  }
}
