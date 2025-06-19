import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, Provider } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';

const toastrConfig = {
  positionClass: 'toast-bottom-right',
  preventDuplicates: true,
  timeOut: 3000,
  closeButton: true,
  progressBar: true,
};

const interceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot(toastrConfig),
      HttpClientModule,
      AppRoutingModule
    ),
    interceptorProvider,
  ],
}).catch((err) => console.error(err));
