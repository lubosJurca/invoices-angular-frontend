import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { AuthService } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ToastService } from '../../shared/services/toast';
import { AiDrawer } from '../ai-drawer/ai-drawer';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, CommonModule, Button, AiDrawer],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  logoutUser() {
    this.authService.logout().subscribe({
      next: (res) => {
        // Success - maybe redirect to login or show success message
        this.router.navigate(['/login']);
        this.toastService.success(res.message);
      },
      error: (error) => {
        if (error.status === 401) {
          // User was already logged out, redirect to login
          this.toastService.error('You are already logged out.');
          this.router.navigate(['/login']);
        } else {
          // Show error message to user
          this.toastService.error('Logout failed. Please try again later.');
          console.error('Logout failed:', error.message);
          // Maybe show a toast notification
        }
      },
    });
  }
}
