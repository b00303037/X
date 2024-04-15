import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AbstractXService } from './api/abstract/abstract-x.service';
import { XService } from './api/x.service';
import { tokenGetter } from './shared/services/token-getter';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy/MM/dd',
  },
  display: {
    dateInput: 'yyyy/MM/dd',
    monthYearLabel: 'yyyy MMM',
    dateA11yLabel: 'yyyy/MM/dd',
    monthYearA11yLabel: 'yyyy MMM',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: environment.allowedDomains,
          skipWhenExpired: true,
        },
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: AbstractXService,
      useClass: XService,
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
};
