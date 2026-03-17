import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-milan-email-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      state('hidden', style({ transform: 'translateY(120px)', opacity: 0 })),
      state('visible', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('hidden => visible', animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)')),
      transition('visible => hidden', animate('300ms ease-in')),
    ])
  ],
  template: `
    <div class="toast-container" [@toastAnimation]="toastState" *ngIf="showToast">
      <div class="toast-card">
        <div class="toast-avatar">👨‍💼</div>
        <div class="toast-content">
          <div class="toast-sender">Milan Karajanev</div>
          <div class="toast-message">{{ currentMessage }}</div>
        </div>
        <button class="toast-close" (click)="dismiss()">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }
    .toast-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #16213E;
      border: 1px solid rgba(220,38,38,0.4);
      border-radius: 12px;
      padding: 14px 16px;
      max-width: 360px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(220,38,38,0.1);
    }
    .toast-avatar {
      font-size: 28px;
      flex-shrink: 0;
    }
    .toast-sender {
      font-size: 12px;
      font-weight: 700;
      color: #DC2626;
      margin-bottom: 3px;
    }
    .toast-message {
      font-size: 13px;
      color: #F1F5F9;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      color: #64748B;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
      margin-left: auto;
      flex-shrink: 0;
      line-height: 1;
      transition: color 0.2s;
    }
    .toast-close:hover { color: #F1F5F9; }
  `]
})
export class MilanEmailToastComponent implements OnInit, OnDestroy {
  messages = [
    '📧 Have you tried asking ChatGPT?',
    '📧 Why Flutter? WHY NOT Flutter!',
    '📧 This migration better be done by EOD!',
    "📧 I've approved the Flutter approach 👍",
    '📧 Remember, we\'re doing this for THE TEAM!',
    '📧 If it doesn\'t work, blame Sandeep 😄',
    '📧 Shabarish said the API is \'almost ready\' again...',
    '📧 Milan here. Ship it. Now. 🚀',
    '📧 I just attended a Flutter webinar. We are AHEAD.',
    '📧 Reminder: standups at 9AM sharp. Sharp.',
  ];

  showToast = false;
  toastState: 'hidden' | 'visible' = 'hidden';
  currentMessage = '';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    setTimeout(() => this.showNextToast(), 3000);
    this.intervalId = setInterval(() => this.showNextToast(), 15000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  showNextToast() {
    if (this.showToast) return;
    this.currentMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
    this.showToast = true;
    setTimeout(() => { this.toastState = 'visible'; }, 10);
    this.timeoutId = setTimeout(() => this.dismiss(), 4000);
  }

  dismiss() {
    this.toastState = 'hidden';
    setTimeout(() => { this.showToast = false; }, 300);
  }
}
