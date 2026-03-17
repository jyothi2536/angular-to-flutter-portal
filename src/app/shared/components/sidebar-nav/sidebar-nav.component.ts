import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface TeamMember {
  name: string;
  emoji: string;
  color: string;
  title: string;
}

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <span class="logo">🎭</span>
        <div class="header-text">
          <h2>Flutter Portal</h2>
          <small>Angular → Flutter</small>
        </div>
      </div>

      <ul class="nav-list">
        <li *ngFor="let item of navItems">
          <a [routerLink]="item.path" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <div class="team-section">
          <p class="team-label">The Dream Team</p>
          <div class="team-avatars">
            <div *ngFor="let member of team" class="avatar-pill" [title]="member.name + ' - ' + member.title" [style.border-color]="member.color">
              <span>{{ member.emoji }}</span>
            </div>
          </div>
        </div>
        <div class="milan-badge">
          ✅ Milan Approved™
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      min-height: 100vh;
      background: #1A1A2E;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(124,58,237,0.3);
      flex-shrink: 0;
    }
    .sidebar-header {
      padding: 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(124,58,237,0.2);
      background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1));
    }
    .logo {
      font-size: 32px;
      line-height: 1;
    }
    .header-text h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #F1F5F9;
      background: linear-gradient(135deg, #7C3AED, #2563EB);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .header-text small {
      color: #94A3B8;
      font-size: 11px;
    }
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 12px 0;
      flex: 1;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      color: #94A3B8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      cursor: pointer;
    }
    .nav-link:hover {
      color: #F1F5F9;
      background: rgba(124,58,237,0.1);
      border-left-color: rgba(124,58,237,0.5);
    }
    .nav-link.active {
      color: #A78BFA;
      background: rgba(124,58,237,0.15);
      border-left-color: #7C3AED;
    }
    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(124,58,237,0.2);
    }
    .team-label {
      font-size: 11px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 10px 0;
    }
    .team-avatars {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    .avatar-pill {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      background: rgba(255,255,255,0.05);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .avatar-pill:hover { transform: scale(1.15); }
    .milan-badge {
      background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2));
      border: 1px solid rgba(124,58,237,0.4);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 700;
      color: #A78BFA;
      text-align: center;
      letter-spacing: 0.03em;
    }
  `]
})
export class SidebarNavComponent {
  navItems: NavItem[] = [
    { path: 'project-setup', label: 'Project Setup', icon: '🔧' },
    { path: 'upload-center', label: 'Upload Center', icon: '📤' },
    { path: 'analysis-dashboard', label: 'Analysis Dashboard', icon: '📊' },
    { path: 'generation-progress', label: 'Generation Progress', icon: '⚡' },
    { path: 'output-download', label: 'Output Download', icon: '📦' },
  ];

  team: TeamMember[] = [
    { name: 'Milan', emoji: '👨‍💼', color: '#DC2626', title: 'The Boss' },
    { name: 'Shabarish', emoji: '🧙', color: '#7C3AED', title: 'API Wizard' },
    { name: 'Sandeep', emoji: '🛡️', color: '#2563EB', title: 'Route Guardian' },
    { name: 'Sanjana', emoji: '🌸', color: '#EC4899', title: 'UI Queen' },
    { name: 'Sivakumar', emoji: '🌿', color: '#10B981', title: 'Backend Sage' },
    { name: 'Sumitava', emoji: '🌟', color: '#F59E0B', title: 'Full Stack Star' },
  ];
}
