import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ButtonModule],
  templateUrl: './home-page.html',
})
export class HomePage {}
