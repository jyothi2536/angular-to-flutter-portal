import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ElectronService } from '../../services/electron.service';

interface TeamMember {
  name: string;
  emoji: string;
  color: string;
  role: string;
  selected: boolean;
}

@Component({
  selector: 'app-project-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatCardModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>🔧 Project Setup</h1>
        <p>Configure your Angular → Flutter migration project</p>
      </div>

      <div class="form-grid">
        <div class="card">
          <h3>📋 Project Details</h3>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Project Name</mat-label>
            <input matInput [(ngModel)]="projectName" placeholder="e.g. awesome-flutter-app">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>GitHub Repository URL</mat-label>
            <input matInput [(ngModel)]="githubUrl" placeholder="https://github.com/org/repo">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Target Flutter Version</mat-label>
            <mat-select [(ngModel)]="flutterVersion">
              <mat-option value="3.19">Flutter 3.19 (Stable)</mat-option>
              <mat-option value="3.16">Flutter 3.16</mat-option>
              <mat-option value="3.13">Flutter 3.13</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="card">
          <h3>👥 Assign Team Members</h3>
          <div class="team-grid">
            <div *ngFor="let member of team" class="team-member-card" [class.selected]="member.selected" [style.border-color]="member.selected ? member.color : 'transparent'" (click)="member.selected = !member.selected">
              <div class="member-avatar" [style.background]="member.color + '22'" [style.border-color]="member.color">
                {{ member.emoji }}
              </div>
              <div class="member-info">
                <div class="member-name" [style.color]="member.color">{{ member.name }}</div>
                <div class="member-role">{{ member.role }}</div>
              </div>
              <mat-checkbox [ngModel]="member.selected" (ngModelChange)="member.selected = $event" [color]="'primary'" class="member-check"></mat-checkbox>
            </div>
          </div>
        </div>

        <div class="card options-card">
          <h3>⚙️ Migration Options</h3>
          <div class="options-list">
            <mat-checkbox [(ngModel)]="options.generateTests" color="primary">
              <span class="option-label">🧪 Generate Test Files</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="options.stateManagement" color="primary">
              <span class="option-label">🗃️ Include State Management (Riverpod)</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="options.generateDocs" color="primary">
              <span class="option-label">📚 Generate Documentation</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="options.darkMode" color="primary">
              <span class="option-label">🌙 Dark Mode Support</span>
            </mat-checkbox>
            <mat-checkbox [(ngModel)]="options.animations" color="primary">
              <span class="option-label">✨ Include Animations</span>
            </mat-checkbox>
          </div>
        </div>
      </div>

      <div class="action-row">
        <div class="milan-note" *ngIf="projectName">
          👨‍💼 Milan says: "{{ projectName }} — I like it! Let's migrate it before lunch!"
        </div>
        <button mat-raised-button class="begin-btn" (click)="beginMigration()" [disabled]="!projectName">
          Begin Migration Journey 🚀
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1100px; margin: 0 auto; min-height: 100vh; background: #0F0F1A; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .page-header p { color: #94A3B8; font-size: 15px; margin: 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .card { background: #16213E; border-radius: 16px; padding: 24px; border: 1px solid rgba(124,58,237,0.2); }
    .card h3 { margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #F1F5F9; }
    .options-card { grid-column: 1 / -1; }
    .full-width { width: 100%; margin-bottom: 8px; }
    ::ng-deep .mat-mdc-form-field { --mdc-outlined-text-field-outline-color: rgba(124,58,237,0.3); --mdc-outlined-text-field-label-text-color: #94A3B8; --mdc-outlined-text-field-input-text-color: #F1F5F9; }
    .team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .team-member-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: 2px solid transparent; background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; }
    .team-member-card:hover { background: rgba(255,255,255,0.06); }
    .team-member-card.selected { background: rgba(124,58,237,0.08); }
    .member-avatar { width: 36px; height: 36px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .member-name { font-size: 13px; font-weight: 700; }
    .member-role { font-size: 11px; color: #64748B; }
    .member-check { margin-left: auto; }
    .options-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .option-label { font-size: 13px; color: #CBD5E1; }
    .action-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .milan-note { background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #FCA5A5; font-style: italic; flex: 1; }
    .begin-btn { background: linear-gradient(135deg, #7C3AED, #2563EB) !important; color: white !important; font-size: 16px !important; font-weight: 700 !important; padding: 12px 32px !important; border-radius: 12px !important; height: auto !important; }
    .begin-btn:disabled { opacity: 0.5; }
  `]
})
export class ProjectSetupComponent {
  projectName = '';
  githubUrl = '';
  flutterVersion = '3.19';

  team: TeamMember[] = [
    { name: 'Milan', emoji: '👨‍💼', color: '#DC2626', role: 'Tech Lead', selected: true },
    { name: 'Shabarish', emoji: '🧙', color: '#7C3AED', role: 'API Wizard', selected: true },
    { name: 'Sandeep', emoji: '🛡️', color: '#2563EB', role: 'Route Guardian', selected: true },
    { name: 'Sanjana', emoji: '🌸', color: '#EC4899', role: 'UI Queen', selected: true },
    { name: 'Sivakumar', emoji: '🌿', color: '#10B981', role: 'Backend Sage', selected: true },
    { name: 'Sumitava', emoji: '🌟', color: '#F59E0B', role: 'Full Stack Star', selected: true },
  ];

  options = {
    generateTests: true,
    stateManagement: true,
    generateDocs: false,
    darkMode: true,
    animations: true,
  };

  constructor(private router: Router, private electronService: ElectronService) {}

  async beginMigration() {
    if (!this.projectName) return;
    await this.electronService.saveConfig({
      projectName: this.projectName,
      githubUrl: this.githubUrl,
      flutterVersion: this.flutterVersion,
      team: this.team.filter(m => m.selected).map(m => m.name),
      options: this.options,
    });
    this.router.navigate(['/upload-center']);
  }
}
