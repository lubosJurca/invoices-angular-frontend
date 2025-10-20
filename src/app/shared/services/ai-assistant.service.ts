import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth/auth.service';

interface AiResponse {
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AiAssistant {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private destroy$ = new Subject<void>();

  // Loading subjects
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  sendQuestion(inputText: string): Observable<AiResponse> {
    this.loadingSubject.next(true);
    return this.http
      .post<AiResponse>(
        environment.apiUrl + '/ai/assistant',
        {
          inputText,
        },
        { headers: this.auth.getAuthHeaders() }
      )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  constructor() {}
}
