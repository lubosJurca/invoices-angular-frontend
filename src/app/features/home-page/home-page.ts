import { Component, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ButtonModule],
  templateUrl: './home-page.html',
})
export class HomePage {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public isLoading = false;

  public loginAsTestUser() {
    this.isLoading = true;

    const email = 'test@test.com';
    const password = 'secret123';
    this.authService
      .loginUser({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Successfully logged in');
          this.toastService.success(res.message);
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error:', err.error.message);
          this.toastService.error(err.error.message || 'Unknown error');
          this.isLoading = false;
        },
      });
  }
}
