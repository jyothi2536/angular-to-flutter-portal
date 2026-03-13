import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'project-setup', pathMatch: 'full' },
  { path: 'project-setup', loadComponent: () => import('./features/project-setup/project-setup.component').then(m => m.ProjectSetupComponent) },
  { path: 'upload-center', loadComponent: () => import('./features/upload-center/upload-center.component').then(m => m.UploadCenterComponent) },
  { path: 'analysis-dashboard', loadComponent: () => import('./features/analysis-dashboard/analysis-dashboard.component').then(m => m.AnalysisDashboardComponent) },
  { path: 'generation-progress', loadComponent: () => import('./features/generation-progress/generation-progress.component').then(m => m.GenerationProgressComponent) },
  { path: 'output-download', loadComponent: () => import('./features/output-download/output-download.component').then(m => m.OutputDownloadComponent) },
  { path: '**', redirectTo: 'project-setup' },
];