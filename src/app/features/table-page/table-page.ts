import { DataService } from './../../shared/services/data.service';
import { Component, inject } from '@angular/core';
import { ActionBar } from '../action-bar/action-bar';
import { MainTable } from '../main-table/main-table';

@Component({
  selector: 'app-table-page',
  imports: [ActionBar, MainTable],
  templateUrl: './table-page.html',
})
export class TablePage {
  private dataService = inject(DataService);
}
