import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from './logging.service';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError, Observable, tap } from 'rxjs';
import { Power } from '../interfaces/power.interface';

@Injectable({
  providedIn: 'root',
})
export class PowerService {
  private resourceUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private logger: LoggingService,
    private errorHandler: ApiErrorHandlerService
  ) {}

  getPowers(heroId: number): Observable<Power[]> {
    return this.http
      .get<Power[]>(`${this.resourceUrl}/heroes/${heroId}/powers`)
      .pipe(
        tap(() => this.logger.debug(`Fetched powers for hero ${heroId}`)),
        catchError(this.errorHandler.handleError<Power[]>('getPowers'))
      );
  }

  updatePowers(heroId: number, powers: string[]): Observable<any> {
    return this.http
      .put<any>(`${this.resourceUrl}/heroes/${heroId}/powers`, { powers })
      .pipe(
        tap(() => this.logger.debug(`Updated powers for hero ${heroId}`)),
        catchError(this.errorHandler.handleError('updatePowers'))
      );
  }
}
