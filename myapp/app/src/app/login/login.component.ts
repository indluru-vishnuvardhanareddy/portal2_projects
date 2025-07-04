import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  vendorId: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    // Ensure vendorId is 10 digits by padding with leading zeros
    const paddedVendorId = this.vendorId.padStart(10, '0');
    
    this.http.post('http://localhost:5000/api/login', {
      vendorId: paddedVendorId,  // Send the padded version to backend
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          if (isPlatformBrowser(this.platformId)) {
            // Store the padded vendorId in localStorage
            localStorage.setItem('vendorId', response.data.vendorId || paddedVendorId);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // For debugging
            console.log('Stored vendorId:', localStorage.getItem('vendorId'));
          }
          
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Error connecting to server';
        this.isLoading = false;
      }
    });
  }

  // Helper method to format vendor ID for display (optional)
  formatVendorId(id: string): string {
    return id ? id.padStart(10, '0') : '';
  }
}