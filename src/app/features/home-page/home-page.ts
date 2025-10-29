import { Component, inject, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';
import { AsyncPipe } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ButtonModule, AsyncPipe],
  templateUrl: './home-page.html',
})
export class HomePage {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public loading$ = this.authService.loading$;

  public loginAsTestUser() {
    const email = 'test@test.com';
    const password = 'secret123';

    const coldStartWarning$ = timer(3000).pipe(
      takeUntilDestroyed(this.destroyRef)
    );

    coldStartWarning$.subscribe(() => {
      if (this.authService.loading$) {
        this.toastService.info(
          'Server is waking up (free tier). This may take 30-60 seconds on first visit. ☕'
        );
      }
    });

    this.authService
      .loginUser({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Successfully logged in');
          this.toastService.success(res.message);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error:', err.error.message);
          this.toastService.error(err.error.message || 'Unknown error');
        },
      });
  }
}
