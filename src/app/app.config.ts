import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideStore({}), provideEffects([]), provideStoreDevtools({ maxAge: 25 })],
};