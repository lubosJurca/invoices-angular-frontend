import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
