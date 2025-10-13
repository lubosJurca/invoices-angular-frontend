import { Component } from '@angular/core';
import { ActionBar } from '../action-bar/action-bar';
import { MainTable } from '../main-table/main-table';
import { MobileCards } from '../mobile-cards/mobile-cards';

@Component({
  selector: 'app-table-page',
  imports: [ActionBar, MainTable, MobileCards],
  templateUrl: './table-page.html',
})
export class TablePage {}
