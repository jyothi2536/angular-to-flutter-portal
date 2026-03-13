import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from './shared/components/sidebar-nav/sidebar-nav.component';
import { MilanEmailToastComponent } from './shared/components/milan-email-toast/milan-email-toast.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarNavComponent, MilanEmailToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent { title = 'angular-to-flutter-portal'; }