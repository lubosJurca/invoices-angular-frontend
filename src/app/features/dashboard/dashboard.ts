import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Data } from '../../shared/services/data';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private data = inject(Data);
}
