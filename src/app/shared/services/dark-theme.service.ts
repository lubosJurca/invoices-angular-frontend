import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkTheme {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-theme');
    this.darkModeSubject.next(!this.darkModeSubject.value);
  }

  constructor() {
    const isDarkMode = document
      .querySelector('html')
      ?.classList.contains('dark-theme');
    this.darkModeSubject.next(!!isDarkMode);
  }
}
