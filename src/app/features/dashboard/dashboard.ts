import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { DataService } from '../../shared/services/data.service';
import { ActionBar } from '../action-bar/action-bar';
import { MainTable } from '../main-table/main-table';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, ActionBar, MainTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private data = inject(DataService);
}
