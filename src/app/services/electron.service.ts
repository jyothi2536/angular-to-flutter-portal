import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>;
      saveConfig: (config: object) => Promise<{ success: boolean }>;
      uploadFile: (filePath: string, destName: string) => Promise<{ success: boolean; path: string }>;
      parseAllFiles: () => Promise<{ routes: number; apis: number; models: number; components: number; testCases: number; warnings: string[]; errors: string[] }>;
      startGeneration: () => Promise<{ success: boolean }>;
      onGenerationProgress: (cb: (data: { step: number; message: string; percent: number }) => void) => void;
      onGenerationComplete: (cb: (data: { filesGenerated: number; linesOfCode: number; timeTaken: number; testFiles: number; apisIntegrated: number; widgetsCreated: number }) => void) => void;
      downloadZip: () => Promise<{ success: boolean }>;
      pushToGitHub: (config: object) => Promise<{ success: boolean; url: string }>;
      getFileContent: (filePath: string) => Promise<string>;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private get api() { return window.electronAPI; }
  isElectron(): boolean { return typeof window !== 'undefined' && !!window.electronAPI; }
  selectFolder() { return this.isElectron() ? this.api.selectFolder() : Promise.resolve(null); }
  saveConfig(config: object) { return this.isElectron() ? this.api.saveConfig(config) : Promise.resolve({ success: true }); }
  uploadFile(filePath: string, destName: string) { return this.isElectron() ? this.api.uploadFile(filePath, destName) : Promise.resolve({ success: true, path: filePath }); }
  parseAllFiles() { return this.isElectron() ? this.api.parseAllFiles() : Promise.resolve({ routes: 47, apis: 203, models: 38, components: 127, testCases: 847, warnings: ['Auth flow unclear', '3 duplicate API endpoints'], errors: [] }); }
  startGeneration() { return this.isElectron() ? this.api.startGeneration() : Promise.resolve({ success: true }); }
  onGenerationProgress(cb: (data: { step: number; message: string; percent: number }) => void) { if (this.isElectron()) this.api.onGenerationProgress(cb); }
  onGenerationComplete(cb: (data: { filesGenerated: number; linesOfCode: number; timeTaken: number; testFiles: number; apisIntegrated: number; widgetsCreated: number }) => void) { if (this.isElectron()) this.api.onGenerationComplete(cb); }
  downloadZip() { return this.isElectron() ? this.api.downloadZip() : Promise.resolve({ success: true }); }
  pushToGitHub(config: object) { return this.isElectron() ? this.api.pushToGitHub(config) : Promise.resolve({ success: true, url: 'https://github.com/example/flutter-project' }); }
  getFileContent(filePath: string) { return this.isElectron() ? this.api.getFileContent(filePath) : Promise.resolve('// mock content'); }
}
