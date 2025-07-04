import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HttpClientModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  isBrowser: boolean;
  vendorId: string | null = localStorage.getItem('vendorId');

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
  if (this.isBrowser) {
    this.vendorId = (this.vendorId ?? '').padStart(10, '0');
    console.log('Formatted Vendor ID:', this.vendorId);

    if (this.vendorId) {
      this.http.get<any>(`http://localhost:5000/api/profile/${this.vendorId}`).subscribe(
        (res) => {
          if (res && res.success && res.data) {
            const data = res.data;
            this.profile = {
              name1: data.Name1,
              lifnr: data.Lifnr,
              ort01: data.Ort01,
              land1: data.Land1,
              bukrs: data.Bukrs,
              pstlz: data.Pstlz,
              ernam: data.Ernam,
              akont: data.Akont
            };
            console.log('Profile data:', this.profile);
          } else {
            this.profile = null;
          }
        },
        (error) => {
          console.error('Profile fetch failed', error);
          this.profile = null;
        }
      );
    }
  }
}


  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
