import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, ButtonModule, DividerModule],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
