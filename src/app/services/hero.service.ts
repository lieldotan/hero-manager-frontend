import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero, HeroCreateSchema } from '../interfaces/hero.interface';
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

  createHero(heroData: HeroCreateSchema): Observable<any> {
    return this.http.post<HeroCreateSchema>(this.resourceUrl, heroData).pipe(
      tap(() => this.logger.debug(`Created hero ${heroData.name}`)),
      catchError(this.errorHandler.handleError<HeroCreateSchema>('createHero'))
    );
  }

  updateLastMission(heroId: number, lastMission: string): Observable<any> {
    return this.http
      .put<Hero>(`${this.resourceUrl}/${heroId}`, { lastMission })
      .pipe(
        tap(() => this.logger.info(`Updated last mission for ${heroId}`)),
        catchError(this.errorHandler.handleError<Hero>('updateLastMission'))
      );
  }

  retireHero(heroId: number): Observable<any> {
    return this.http.put(`${this.resourceUrl}/${heroId}/retire`, {}).pipe(
      tap(() => this.logger.info(`Retired hero ${heroId}`)),
      catchError(this.errorHandler.handleError('retireHero'))
    );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.resourceUrl}/${id}`).pipe(
      tap(() => this.logger.debug(`Fetched hero ${id}`)),
      catchError(this.errorHandler.handleError<Hero>('getHero'))
    );
  }
}
