import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Invoice } from '../../shared/models/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main-table',
  imports: [TableModule, CommonModule],
  templateUrl: './main-table.html',
  styleUrl: './main-table.css',
})
export class MainTable implements OnInit {
  private data$ = inject(DataService);

  ngOnInit(): void {
    // TODO: add data to fill the table out
  }
}
