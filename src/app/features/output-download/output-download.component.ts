import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ElectronService } from '../../services/electron.service';
import { AnalysisService, GenerationResult } from '../../services/analysis.service';

interface ResultStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface FlutterFile {
  name: string;
  path: string;
  icon: string;
  lines: number;
}

@Component({
  selector: 'app-output-download',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📦 Output Download</h1>
        <p>Your Flutter app is ready! Milan approves. 🏆</p>
      </div>

      <div class="stats-grid">
        <div *ngFor="let stat of resultStats" class="stat-card" [style.border-color]="stat.color + '44'">
          <div class="stat-icon" [style.background]="stat.color + '22'">{{ stat.icon }}</div>
          <div class="stat-value" [style.color]="stat.color">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="file-browser card">
          <h3>📁 Generated Flutter Files</h3>
          <div class="file-list">
            <div *ngFor="let file of generatedFiles" class="file-row">
              <span class="file-icon">{{ file.icon }}</span>
              <div class="file-info">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-path">{{ file.path }}</div>
              </div>
              <div class="file-lines">{{ file.lines }} lines</div>
            </div>
          </div>
        </div>

        <div class="actions-panel">
          <div class="card download-card">
            <h3>⬇️ Download</h3>
            <p>Get your complete Flutter project as a ZIP file</p>
            <button mat-raised-button class="download-btn" (click)="downloadZip()" [disabled]="isDownloading">
              {{ isDownloading ? 'Preparing...' : 'Download ZIP 📦' }}
            </button>
          </div>

          <div class="card github-card">
            <h3>🐙 Push to GitHub</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>GitHub Token</mat-label>
              <input matInput [(ngModel)]="githubToken" type="password" placeholder="ghp_...">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Repository Name</mat-label>
              <input matInput [(ngModel)]="repoName" placeholder="my-flutter-app">
            </mat-form-field>
            <button mat-raised-button class="github-btn" (click)="pushToGitHub()" [disabled]="!githubToken || isPushing">
              {{ isPushing ? 'Pushing...' : 'Push to GitHub 🚀' }}
            </button>
            <div class="github-success" *ngIf="githubUrl">
              ✅ Pushed! <a [href]="githubUrl" target="_blank" style="color:#A78BFA">{{ githubUrl }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="celebration-section">
        <h3>🎉 Team Celebration!</h3>
        <div class="celebration-row">
          <div *ngFor="let m of teamCelebration; let i = index" class="celebrate-card" [style.border-color]="m.color + '66'" [style.animation-delay]="(i * 0.15) + 's'">
            <div class="celebrate-emoji" [style.background]="m.color + '22'">{{ m.emoji }}</div>
            <div class="celebrate-name" [style.color]="m.color">{{ m.name }}</div>
            <div class="celebrate-quote">"{{ m.quote }}"</div>
          </div>
        </div>
      </div>

      <div class="confetti-row">
        <span *ngFor="let c of confetti" class="confetti-piece" [style.color]="c.color" [style.animation-delay]="c.delay">{{ c.symbol }}</span>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1100px; margin: 0 auto; min-height: 100vh; background: #0F0F1A; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .page-header p { color: #94A3B8; font-size: 15px; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 28px; }
    .stat-card { background: #16213E; border-radius: 14px; padding: 18px 12px; text-align: center; border: 2px solid; }
    .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 10px auto; }
    .stat-value { font-size: 24px; font-weight: 900; margin-bottom: 4px; }
    .stat-label { font-size: 11px; color: #94A3B8; font-weight: 600; }
    .content-grid { display: grid; grid-template-columns: 1fr 360px; gap: 20px; margin-bottom: 28px; }
    .card { background: #16213E; border-radius: 16px; padding: 22px; border: 1px solid rgba(124,58,237,0.2); }
    .card h3 { margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #F1F5F9; }
    .file-browser h3 { margin-bottom: 14px; }
    .file-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
    .file-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
    .file-icon { font-size: 20px; }
    .file-name { font-size: 13px; color: #F1F5F9; font-weight: 500; }
    .file-path { font-size: 11px; color: #64748B; }
    .file-lines { margin-left: auto; font-size: 11px; color: #A78BFA; white-space: nowrap; }
    .actions-panel { display: flex; flex-direction: column; gap: 16px; }
    .download-card p, .github-card p { font-size: 13px; color: #94A3B8; margin: 0 0 16px 0; }
    .full-width { width: 100%; margin-bottom: 12px; }
    .download-btn { background: linear-gradient(135deg, #10B981, #2563EB) !important; color: white !important; font-weight: 700 !important; width: 100%; padding: 12px !important; border-radius: 10px !important; height: auto !important; }
    .github-btn { background: linear-gradient(135deg, #1F2937, #374151) !important; color: #F1F5F9 !important; font-weight: 700 !important; width: 100%; padding: 12px !important; border-radius: 10px !important; height: auto !important; border: 1px solid rgba(255,255,255,0.15) !important; }
    .github-success { margin-top: 12px; font-size: 12px; color: #6EE7B7; word-break: break-all; }
    .celebration-section { margin-bottom: 28px; }
    .celebration-section h3 { font-size: 20px; font-weight: 700; color: #F1F5F9; margin: 0 0 20px 0; }
    .celebration-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .celebrate-card { background: #16213E; border-radius: 14px; padding: 18px 12px; text-align: center; border: 2px solid; animation: float 3s ease-in-out infinite; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .celebrate-emoji { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 10px auto; }
    .celebrate-name { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
    .celebrate-quote { font-size: 10px; color: #64748B; font-style: italic; }
    .confetti-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; padding: 16px 0; }
    .confetti-piece { font-size: 24px; animation: confetti-fall 2s ease-in-out infinite; }
    @keyframes confetti-fall { 0%{transform:translateY(-10px) rotate(0deg); opacity:1} 100%{transform:translateY(20px) rotate(360deg); opacity:0.3} }
    ::ng-deep .mat-mdc-form-field { --mdc-outlined-text-field-outline-color: rgba(124,58,237,0.3); --mdc-outlined-text-field-label-text-color: #94A3B8; --mdc-outlined-text-field-input-text-color: #F1F5F9; }
  `]
})
export class OutputDownloadComponent implements OnInit {
  isDownloading = false;
  isPushing = false;
  githubToken = '';
  repoName = 'my-flutter-app';
  githubUrl = '';

  resultStats: ResultStat[] = [];

  generatedFiles: FlutterFile[] = [
    { name: 'main.dart', path: 'lib/', icon: '🎯', lines: 48 },
    { name: 'app.dart', path: 'lib/', icon: '📱', lines: 120 },
    { name: 'auth_service.dart', path: 'lib/services/', icon: '🔑', lines: 203 },
    { name: 'api_client.dart', path: 'lib/services/', icon: '🔌', lines: 340 },
    { name: 'home_screen.dart', path: 'lib/screens/', icon: '🏠', lines: 180 },
    { name: 'dashboard_screen.dart', path: 'lib/screens/', icon: '📊', lines: 260 },
    { name: 'user_model.dart', path: 'lib/models/', icon: '👤', lines: 55 },
    { name: 'product_model.dart', path: 'lib/models/', icon: '📦', lines: 70 },
    { name: 'app_router.dart', path: 'lib/router/', icon: '🗺️', lines: 95 },
    { name: 'theme.dart', path: 'lib/theme/', icon: '🎨', lines: 80 },
    { name: 'home_widget.dart', path: 'lib/widgets/', icon: '🧩', lines: 110 },
    { name: 'auth_widget.dart', path: 'lib/widgets/', icon: '🔒', lines: 130 },
  ];

  teamCelebration = [
    { name: 'Milan', emoji: '👨‍💼', color: '#DC2626', quote: 'APPROVED. Ship it.' },
    { name: 'Shabarish', emoji: '🧙', color: '#7C3AED', quote: 'APIs are perfect!' },
    { name: 'Sandeep', emoji: '🛡️', color: '#2563EB', quote: 'Routes secured!' },
    { name: 'Sanjana', emoji: '🌸', color: '#EC4899', quote: 'It\'s beautiful! 💅' },
    { name: 'Sivakumar', emoji: '🌿', color: '#10B981', quote: 'Clean & efficient.' },
    { name: 'Sumitava', emoji: '🌟', color: '#F59E0B', quote: 'We are LEGENDARY.' },
  ];

  confetti = [
    { symbol: '🎊', color: '#7C3AED', delay: '0s' }, { symbol: '🎉', color: '#DC2626', delay: '0.2s' },
    { symbol: '✨', color: '#F59E0B', delay: '0.4s' }, { symbol: '🏆', color: '#10B981', delay: '0.6s' },
    { symbol: '🎊', color: '#EC4899', delay: '0.8s' }, { symbol: '🚀', color: '#2563EB', delay: '1s' },
    { symbol: '⚡', color: '#7C3AED', delay: '1.2s' }, { symbol: '🎉', color: '#F59E0B', delay: '1.4s' },
  ];

  constructor(private router: Router, private electronService: ElectronService, private analysisService: AnalysisService) {}

  ngOnInit() {
    const result = this.analysisService.getGenerationResult();
    if (result) {
      this.buildStats(result);
    } else {
      this.buildStats({ filesGenerated: 127, linesOfCode: 14820, timeTaken: 42, testFiles: 87, apisIntegrated: 203, widgetsCreated: 94 });
    }
  }

  buildStats(r: GenerationResult) {
    this.resultStats = [
      { label: 'Files Generated', value: r.filesGenerated, icon: '📄', color: '#7C3AED' },
      { label: 'Lines of Code', value: r.linesOfCode.toLocaleString(), icon: '💻', color: '#2563EB' },
      { label: 'Time Taken', value: r.timeTaken + 's', icon: '⏱️', color: '#10B981' },
      { label: 'Test Files', value: r.testFiles, icon: '🧪', color: '#F59E0B' },
      { label: 'APIs Integrated', value: r.apisIntegrated, icon: '🔌', color: '#EC4899' },
      { label: 'Widgets Created', value: r.widgetsCreated, icon: '🧩', color: '#DC2626' },
    ];
  }

  async downloadZip() {
    this.isDownloading = true;
    await this.electronService.downloadZip();
    setTimeout(() => { this.isDownloading = false; }, 2000);
  }

  async pushToGitHub() {
    if (!this.githubToken) return;
    this.isPushing = true;
    const result = await this.electronService.pushToGitHub({ token: this.githubToken, repo: this.repoName });
    this.githubUrl = result.url;
    this.isPushing = false;
  }
}
