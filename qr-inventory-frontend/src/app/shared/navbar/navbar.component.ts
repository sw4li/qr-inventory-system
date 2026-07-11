import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  currentUser: any;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(){
    this.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((result) => {
      this.currentUser = result?.data;
    });
  }
}
