import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private apiUrl = environment.apiUrl + '/heroes';

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError)
    );
  }

  private log(message: string) {
    console.log(`HeroService: ${message}`);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.ok) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error)}`
      );
    }
    return throwError(
      () =>
        new Error('There was an error fetching heroes. Please try again later.')
    );
  }
}
