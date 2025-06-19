import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../environments/environment';
import { LoggingService } from './logging.service';
import { ApiErrorHandlerService } from './api-error-handler.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private resourceUrl = `${environment.apiUrl}/heroes`;

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
    private errorHandler: ApiErrorHandlerService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.resourceUrl).pipe(
      tap(() => this.logger.debug('Fetched heroes')),
      catchError(this.errorHandler.handleError<Hero[]>('getHeroes'))
    );
  }
}
