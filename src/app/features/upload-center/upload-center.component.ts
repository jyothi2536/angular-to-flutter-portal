import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ElectronService } from '../../services/electron.service';
import { AnalysisService } from '../../services/analysis.service';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  icon: string;
}

@Component({
  selector: 'app-upload-center',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📤 Upload Center</h1>
        <p>Upload your Angular project files for migration analysis</p>
      </div>

      <div class="drop-zone" [class.dragover]="isDragging" (dragover)="onDragOver($event)" (dragleave)="isDragging = false" (drop)="onDrop($event)" (click)="triggerFileInput()">
        <div class="drop-content">
          <div class="drop-icon">{{ isDragging ? '📂' : '📁' }}</div>
          <h3>{{ isDragging ? 'Release to Upload!' : 'Drag & Drop Files Here' }}</h3>
          <p>or click to browse</p>
          <div class="file-types">
            <span class="type-badge">📦 ZIP</span>
            <span class="type-badge">📝 DOCX</span>
            <span class="type-badge">📊 CSV</span>
            <span class="type-badge">⚙️ YAML</span>
          </div>
        </div>
        <input #fileInput type="file" multiple accept=".zip,.doc,.docx,.csv,.yaml,.yml" (change)="onFileSelected($event)" style="display:none">
      </div>

      <div class="uploaded-files" *ngIf="uploadedFiles.length > 0">
        <h3>📎 Uploaded Files ({{ uploadedFiles.length }})</h3>
        <div class="file-list">
          <div *ngFor="let file of uploadedFiles; let i = index" class="file-item">
            <span class="file-icon">{{ file.icon }}</span>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-meta">{{ file.type }} · {{ file.size }}</div>
            </div>
            <button class="remove-btn" (click)="removeFile(i)">✕</button>
          </div>
        </div>
      </div>

      <div class="parsing-overlay" *ngIf="isParsing">
        <div class="parsing-card">
          <div class="parsing-emoji">🔍</div>
          <h3>Analyzing your Angular project...</h3>
          <p>Shabarish is counting APIs, Sandeep is mapping routes!</p>
          <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
        </div>
      </div>

      <div class="team-tip">
        <span class="tip-avatar">🧙</span>
        <span class="tip-text">Shabarish Pro Tip: ZIP your entire Angular project for best results!</span>
      </div>

      <div class="action-row">
        <button mat-stroked-button routerLink="/project-setup" style="color:#94A3B8;border-color:rgba(148,163,184,0.3)">← Back to Setup</button>
        <button mat-raised-button class="analyze-btn" (click)="analyzeProject()" [disabled]="isParsing">
          {{ uploadedFiles.length === 0 ? 'Analyze Demo Project 🔍' : 'Analyze Project 🔍' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 800px; margin: 0 auto; min-height: 100vh; background: #0F0F1A; position: relative; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .page-header p { color: #94A3B8; font-size: 15px; margin: 0; }
    .drop-zone { border: 2px dashed rgba(124,58,237,0.4); border-radius: 20px; padding: 60px 40px; text-align: center; cursor: pointer; transition: all 0.3s; background: #16213E; margin-bottom: 24px; }
    .drop-zone:hover, .drop-zone.dragover { border-color: #7C3AED; background: rgba(124,58,237,0.08); transform: scale(1.01); }
    .drop-icon { font-size: 64px; margin-bottom: 16px; }
    .drop-content h3 { font-size: 20px; color: #F1F5F9; margin: 0 0 8px 0; font-weight: 700; }
    .drop-content p { color: #94A3B8; margin: 0 0 20px 0; }
    .file-types { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
    .type-badge { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); border-radius: 20px; padding: 4px 14px; font-size: 12px; color: #A78BFA; font-weight: 600; }
    .uploaded-files { background: #16213E; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(124,58,237,0.2); }
    .uploaded-files h3 { margin: 0 0 16px 0; color: #F1F5F9; font-size: 15px; }
    .file-list { display: flex; flex-direction: column; gap: 10px; }
    .file-item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border-radius: 10px; padding: 12px 14px; border: 1px solid rgba(255,255,255,0.08); }
    .file-icon { font-size: 24px; }
    .file-name { font-size: 14px; color: #F1F5F9; font-weight: 500; }
    .file-meta { font-size: 12px; color: #64748B; }
    .remove-btn { margin-left: auto; background: none; border: none; color: #64748B; cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px; transition: all 0.2s; }
    .remove-btn:hover { background: rgba(220,38,38,0.15); color: #FCA5A5; }
    .parsing-overlay { position: fixed; inset: 0; background: rgba(15,15,26,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
    .parsing-card { background: #16213E; border: 1px solid rgba(124,58,237,0.4); border-radius: 20px; padding: 40px; text-align: center; max-width: 400px; }
    .parsing-emoji { font-size: 56px; margin-bottom: 16px; }
    .parsing-card h3 { color: #F1F5F9; font-size: 20px; margin: 0 0 8px 0; }
    .parsing-card p { color: #94A3B8; font-size: 14px; margin: 0 0 24px 0; }
    .team-tip { display: flex; align-items: center; gap: 12px; background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; font-size: 13px; color: #A78BFA; }
    .tip-avatar { font-size: 22px; }
    .action-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .analyze-btn { background: linear-gradient(135deg, #7C3AED, #2563EB) !important; color: white !important; font-size: 15px !important; font-weight: 700 !important; padding: 12px 28px !important; border-radius: 12px !important; height: auto !important; }
    .analyze-btn:disabled { opacity: 0.5; }
  `]
})
export class UploadCenterComponent {
  isDragging = false;
  isParsing = false;
  uploadedFiles: UploadedFile[] = [];

  private fileIcons: Record<string, string> = { zip: '📦', doc: '📝', docx: '📝', csv: '📊', yaml: '⚙️', yml: '⚙️' };

  constructor(private router: Router, private electronService: ElectronService, private analysisService: AnalysisService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) this.processFiles(files);
  }

  triggerFileInput() {
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(input.files);
  }

  processFiles(files: FileList) {
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const sizeKb = Math.round(file.size / 1024);
      const size = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      this.uploadedFiles.push({ name: file.name, size, type: ext.toUpperCase(), icon: this.fileIcons[ext] || '📄' });
    });
  }

  removeFile(index: number) { this.uploadedFiles.splice(index, 1); }

  async analyzeProject() {
    this.isParsing = true;
    try {
      const result = await this.electronService.parseAllFiles();
      this.analysisService.setAnalysisResult(result);
      setTimeout(() => {
        this.isParsing = false;
        this.router.navigate(['/analysis-dashboard']);
      }, 2000);
    } catch {
      this.isParsing = false;
    }
  }
}
