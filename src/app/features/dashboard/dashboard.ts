import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Data } from '../../shared/services/data';
import { ActionBar } from '../action-bar/action-bar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, ActionBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private data = inject(Data);
}
