import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ElectronService } from '../../services/electron.service';
import { AnalysisService } from '../../services/analysis.service';

interface GenerationStep {
  step: number;
  message: string;
  character: string;
  emoji: string;
  color: string;
  completed: boolean;
}

@Component({
  selector: 'app-generation-progress',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>⚡ Generation Progress</h1>
        <p>The team is working their magic on your Flutter app!</p>
      </div>

      <div class="progress-section" *ngIf="!isComplete">
        <div class="current-step-card">
          <div class="step-animation">{{ currentCharacterEmoji }}</div>
          <div class="step-info">
            <div class="step-character" [style.color]="currentCharacterColor">{{ currentCharacter }}</div>
            <div class="step-message">{{ currentMessage }}</div>
            <div class="step-percent">{{ percent }}%</div>
          </div>
        </div>
        <div class="progress-bar-wrapper">
          <mat-progress-bar mode="determinate" [value]="percent" class="main-progress"></mat-progress-bar>
        </div>
      </div>

      <div class="steps-list">
        <div *ngFor="let step of steps" class="step-item" [class.completed]="step.completed" [class.active]="currentStep === step.step && !isComplete">
          <div class="step-check">{{ step.completed ? '✅' : currentStep === step.step ? step.emoji : '⬜' }}</div>
          <div class="step-content">
            <div class="step-character-name" [style.color]="step.color">{{ step.character }}</div>
            <div class="step-label">{{ step.message }}</div>
          </div>
        </div>
      </div>

      <div class="complete-card" *ngIf="isComplete">
        <div class="complete-emoji">🎊</div>
        <h2>Flutter Code Generated!</h2>
        <p>Milan has officially approved this migration! 🏆</p>
        <div class="complete-team">
          <span *ngFor="let e of celebrationEmojis" class="celebrate-emoji">{{ e }}</span>
        </div>
        <button mat-raised-button class="download-btn" (click)="goToDownload()">
          View Output 📦
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 800px; margin: 0 auto; min-height: 100vh; background: #0F0F1A; }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .page-header p { color: #94A3B8; font-size: 15px; margin: 0; }
    .current-step-card { background: #16213E; border-radius: 16px; padding: 28px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(124,58,237,0.3); margin-bottom: 16px; }
    .step-animation { font-size: 56px; animation: bounce 1s infinite; }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .step-character { font-size: 15px; font-weight: 800; margin-bottom: 6px; }
    .step-message { font-size: 14px; color: #CBD5E1; margin-bottom: 6px; }
    .step-percent { font-size: 32px; font-weight: 900; color: #7C3AED; }
    .progress-bar-wrapper { margin-bottom: 28px; }
    ::ng-deep .main-progress { height: 8px !important; border-radius: 4px !important; }
    ::ng-deep .main-progress .mdc-linear-progress__bar-inner { border-color: #7C3AED !important; }
    .steps-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .step-item { display: flex; align-items: center; gap: 14px; background: #16213E; border-radius: 12px; padding: 14px 18px; border: 1px solid rgba(255,255,255,0.06); transition: all 0.3s; }
    .step-item.completed { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.05); }
    .step-item.active { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.08); animation: pulse-border 2s infinite; }
    @keyframes pulse-border { 0%,100%{border-color:rgba(124,58,237,0.4)} 50%{border-color:rgba(124,58,237,0.8)} }
    .step-check { font-size: 22px; width: 28px; text-align: center; }
    .step-character-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
    .step-label { font-size: 13px; color: #94A3B8; }
    .complete-card { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(124,58,237,0.1)); border: 2px solid rgba(16,185,129,0.3); border-radius: 20px; padding: 48px; text-align: center; }
    .complete-emoji { font-size: 72px; margin-bottom: 16px; }
    .complete-card h2 { font-size: 28px; font-weight: 800; color: #F1F5F9; margin: 0 0 8px 0; }
    .complete-card p { color: #94A3B8; font-size: 15px; margin: 0 0 24px 0; }
    .complete-team { display: flex; justify-content: center; gap: 10px; font-size: 32px; margin-bottom: 28px; }
    .celebrate-emoji { animation: spin-bounce 1.5s infinite; animation-delay: var(--delay, 0s); display: inline-block; }
    .download-btn { background: linear-gradient(135deg, #10B981, #2563EB) !important; color: white !important; font-size: 16px !important; font-weight: 700 !important; padding: 14px 36px !important; border-radius: 12px !important; height: auto !important; }
  `]
})
export class GenerationProgressComponent implements OnInit, OnDestroy {
  currentStep = 0;
  currentMessage = 'Initializing...';
  currentCharacter = 'The Team';
  currentCharacterEmoji = '⚡';
  currentCharacterColor = '#7C3AED';
  percent = 0;
  isComplete = false;
  celebrationEmojis = ['👨‍💼', '🧙', '🛡️', '🌸', '🌿', '🌟'];

  steps: GenerationStep[] = [
    { step: 1, message: 'Parsing Angular component tree', character: 'Sanjana', emoji: '🌸', color: '#EC4899', completed: false },
    { step: 2, message: 'Building the Flutter API layer', character: 'Shabarish', emoji: '🧙', color: '#7C3AED', completed: false },
    { step: 3, message: 'Securing the navigation routes', character: 'Sandeep', emoji: '🛡️', color: '#2563EB', completed: false },
    { step: 4, message: 'Migrating data models & services', character: 'Sivakumar', emoji: '🌿', color: '#10B981', completed: false },
    { step: 5, message: 'Generating widget tree & UI', character: 'Sumitava', emoji: '🌟', color: '#F59E0B', completed: false },
    { step: 6, message: 'Running final QA & Milan approval', character: 'Milan', emoji: '👨‍💼', color: '#DC2626', completed: false },
  ];

  private simulationInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router, private electronService: ElectronService, private analysisService: AnalysisService) {}

  ngOnInit() {
    this.startSimulation();
    this.electronService.startGeneration();
    this.electronService.onGenerationProgress(data => {
      this.percent = data.percent;
      this.currentMessage = data.message;
      this.currentStep = data.step;
    });
    this.electronService.onGenerationComplete(data => {
      this.analysisService.setGenerationResult(data);
      this.completeGeneration();
    });
  }

  ngOnDestroy() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
  }

  startSimulation() {
    let stepIdx = 0;
    this.simulationInterval = setInterval(() => {
      if (stepIdx >= this.steps.length) {
        this.completeGeneration();
        if (this.simulationInterval) clearInterval(this.simulationInterval);
        return;
      }
      const step = this.steps[stepIdx];
      this.currentStep = step.step;
      this.currentMessage = step.message;
      this.currentCharacter = step.character;
      this.currentCharacterEmoji = step.emoji;
      this.currentCharacterColor = step.color;
      this.percent = Math.round(((stepIdx + 1) / this.steps.length) * 95);
      if (stepIdx > 0) this.steps[stepIdx - 1].completed = true;
      stepIdx++;
    }, 2000);
  }

  completeGeneration() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    this.steps.forEach(s => s.completed = true);
    this.percent = 100;
    setTimeout(() => { this.isComplete = true; }, 500);
  }

  goToDownload() { this.router.navigate(['/output-download']); }
}
