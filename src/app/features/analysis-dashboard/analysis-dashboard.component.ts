import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AnalysisService, AnalysisResult } from '../../services/analysis.service';
import { ElectronService } from '../../services/electron.service';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  description: string;
}

interface TeamReaction {
  name: string;
  emoji: string;
  reaction: string;
  color: string;
}

@Component({
  selector: 'app-analysis-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📊 Analysis Dashboard</h1>
        <p>Here's what we found in your Angular project!</p>
      </div>

      <div class="stats-grid">
        <div *ngFor="let stat of stats" class="stat-card" [style.border-color]="stat.color + '44'">
          <div class="stat-icon" [style.background]="stat.color + '22'">{{ stat.icon }}</div>
          <div class="stat-value" [style.color]="stat.color">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-desc">{{ stat.description }}</div>
        </div>
      </div>

      <div class="warnings-section" *ngIf="warnings.length > 0">
        <h3>⚠️ Warnings ({{ warnings.length }})</h3>
        <div class="warning-list">
          <div *ngFor="let warning of warnings" class="warning-item">
            <span>⚠️</span>
            <span>{{ warning }}</span>
          </div>
        </div>
      </div>

      <div class="reactions-section">
        <h3>🎉 Team Reactions</h3>
        <div class="reactions-grid">
          <div *ngFor="let member of teamReactions" class="reaction-card" [style.border-color]="member.color + '44'">
            <div class="reaction-avatar" [style.background]="member.color + '22'">{{ member.emoji }}</div>
            <div class="reaction-name" [style.color]="member.color">{{ member.name }}</div>
            <div class="reaction-text">"{{ member.reaction }}"</div>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button mat-stroked-button routerLink="/upload-center" style="color:#94A3B8;border-color:rgba(148,163,184,0.3)">← Back to Upload</button>
        <button mat-raised-button class="generate-btn" (click)="startGeneration()">
          Generate Flutter Code ⚡
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1100px; margin: 0 auto; min-height: 100vh; background: #0F0F1A; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .page-header p { color: #94A3B8; font-size: 15px; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #16213E; border-radius: 16px; padding: 24px 16px; text-align: center; border: 2px solid; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 14px auto; }
    .stat-value { font-size: 36px; font-weight: 900; margin-bottom: 6px; }
    .stat-label { font-size: 13px; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; }
    .stat-desc { font-size: 11px; color: #64748B; }
    .warnings-section { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.3); border-radius: 16px; padding: 24px; margin-bottom: 28px; }
    .warnings-section h3 { margin: 0 0 16px 0; color: #FCD34D; font-size: 16px; }
    .warning-list { display: flex; flex-direction: column; gap: 10px; }
    .warning-item { display: flex; gap: 10px; font-size: 13px; color: #FDE68A; background: rgba(245,158,11,0.05); border-radius: 8px; padding: 10px 14px; }
    .reactions-section { margin-bottom: 32px; }
    .reactions-section h3 { margin: 0 0 20px 0; color: #F1F5F9; font-size: 18px; font-weight: 700; }
    .reactions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .reaction-card { background: #16213E; border-radius: 14px; padding: 18px; border: 2px solid; text-align: center; }
    .reaction-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 10px auto; }
    .reaction-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .reaction-text { font-size: 12px; color: #94A3B8; font-style: italic; }
    .action-row { display: flex; justify-content: space-between; align-items: center; }
    .generate-btn { background: linear-gradient(135deg, #7C3AED, #2563EB) !important; color: white !important; font-size: 15px !important; font-weight: 700 !important; padding: 12px 28px !important; border-radius: 12px !important; height: auto !important; }
  `]
})
export class AnalysisDashboardComponent implements OnInit {
  stats: StatCard[] = [];
  warnings: string[] = [];
  teamReactions: TeamReaction[] = [
    { name: 'Milan', emoji: '👨‍💼', reaction: 'Impressive! Now generate it by EOD!', color: '#DC2626' },
    { name: 'Shabarish', emoji: '🧙', reaction: '203 APIs? I\'ve already mapped them all in my head!', color: '#7C3AED' },
    { name: 'Sandeep', emoji: '🛡️', reaction: '47 routes secured and ready to migrate!', color: '#2563EB' },
    { name: 'Sanjana', emoji: '🌸', reaction: '127 components?! Each one will be beautiful in Flutter!', color: '#EC4899' },
    { name: 'Sivakumar', emoji: '🌿', reaction: 'The models are clean. I approve.', color: '#10B981' },
    { name: 'Sumitava', emoji: '🌟', reaction: '847 test cases? Challenge accepted!', color: '#F59E0B' },
  ];

  constructor(private router: Router, private analysisService: AnalysisService, private electronService: ElectronService) {}

  async ngOnInit() {
    let result = this.analysisService.getAnalysisResult();
    if (!result) {
      result = await this.electronService.parseAllFiles();
      this.analysisService.setAnalysisResult(result);
    }
    this.buildStats(result);
    this.warnings = result.warnings;
  }

  buildStats(r: AnalysisResult) {
    this.stats = [
      { label: 'Routes', value: r.routes, icon: '🗺️', color: '#2563EB', description: 'Angular routes found' },
      { label: 'APIs', value: r.apis, icon: '🔌', color: '#7C3AED', description: 'HTTP endpoints detected' },
      { label: 'Models', value: r.models, icon: '📦', color: '#10B981', description: 'Data models parsed' },
      { label: 'Components', value: r.components, icon: '🧩', color: '#EC4899', description: 'UI components found' },
      { label: 'Test Cases', value: r.testCases, icon: '🧪', color: '#F59E0B', description: 'Tests to migrate' },
    ];
  }

  startGeneration() { this.router.navigate(['/generation-progress']); }
}
