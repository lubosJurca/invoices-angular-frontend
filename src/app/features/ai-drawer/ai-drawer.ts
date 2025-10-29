import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AiAssistant } from '../../shared/services/ai-assistant.service';

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
  private aiService = inject(AiAssistant);
  public visible: boolean = false;
  public inputText: string = '';
  public outputText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isLoading = this.aiService.loading$;

  submitQuestion(): void {
    if (!this.inputText.trim()) return;

    const currentInput = this.inputText;

    this.aiService.sendQuestion(currentInput).subscribe({
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
}
