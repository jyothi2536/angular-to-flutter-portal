import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AnalysisResult {
  routes: number;
  apis: number;
  models: number;
  components: number;
  testCases: number;
  warnings: string[];
  errors: string[];
}

export interface GenerationResult {
  filesGenerated: number;
  linesOfCode: number;
  timeTaken: number;
  testFiles: number;
  apisIntegrated: number;
  widgetsCreated: number;
}

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private analysisResult = new BehaviorSubject<AnalysisResult | null>(null);
  private generationResult = new BehaviorSubject<GenerationResult | null>(null);

  analysisResult$ = this.analysisResult.asObservable();
  generationResult$ = this.generationResult.asObservable();

  setAnalysisResult(result: AnalysisResult) { this.analysisResult.next(result); }
  getAnalysisResult(): AnalysisResult | null { return this.analysisResult.getValue(); }

  setGenerationResult(result: GenerationResult) { this.generationResult.next(result); }
  getGenerationResult(): GenerationResult | null { return this.generationResult.getValue(); }
}
