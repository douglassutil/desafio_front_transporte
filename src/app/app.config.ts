import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducers } from './modules/logistic/state/app.reducers';
import { DashboardEffects } from './modules/logistic/pages/dashboard/state/dashboard.effects';
import { DeliveryEffects } from './modules/logistic/pages/delivey/state/delivery.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withJsonpSupport()),
    provideStore(appReducers),
    provideEffects(DeliveryEffects, DashboardEffects)
],
};
