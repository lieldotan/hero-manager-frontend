import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { LoggingService, LogLevel } from './logging.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ApiErrorHandlerService {

  constructor(
    private logger: LoggingService,
    private notify: NotificationService
  ) {}

  /**
   * Returns a function that handles an HttpErrorResponse
   * @param operation  The name of the operation (e.g. 'getHeroes')
   */
  handleError<T>(operation: string) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        const msg = `Client error in ${operation}: ${error.error.message}`;
        this.logger.log(msg, 'ERROR');
        this.notify.error(error.error.message, `Error in ${operation}`);
      } 
      else {
        const msg = `Server error in ${operation}: [${error.status}] ${error.error}`;
        this.logger.log(msg, 'ERROR');
        const userMsg = error.error?.message || `Unexpected server error (${error.status})`;
        this.notify.error(userMsg, `Error in ${operation}`);
      }

      return throwError(() => new Error(`Error during ${operation}; please try again later.`));
    };
  }
}