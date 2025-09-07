import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

interface AiResponse {
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-ai-drawer',
  imports: [
    DrawerModule,
    ButtonModule,
    TextareaModule,
    FloatLabel,
    FormsModule,
    AsyncPipe,
    ProgressSpinner,
  ],
  templateUrl: './ai-drawer.html',
})
export class AiDrawer {
  public visible: boolean = false;
  public inputText: string = '';
  public outputText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isLoading: boolean = false;

  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  submitQuestion(): void {
    if (!this.inputText.trim() || this.isLoading) return;

    this.isLoading = true;
    const currentInput = this.inputText;

    this.http
      .post<AiResponse>(
        environment.apiUrl + '/ai/assistant',
        { inputText: currentInput },
        { withCredentials: true }
      )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response) => {
          this.outputText$.next(response.message);
          this.inputText = '';
        },
        error: (error) => {
          console.error('Error:', error);
          const errorMessage =
            error.error?.message ||
            error.message ||
            'An unexpected error occurred';
          this.outputText$.next('Error: ' + errorMessage);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
