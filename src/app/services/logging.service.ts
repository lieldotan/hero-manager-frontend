import { Injectable, InjectionToken, Inject } from '@angular/core';
import * as log from 'loglevel';
import { environment } from '../../environments/environment';

export const LOG_LEVEL = new InjectionToken<log.LogLevelDesc>('LOG_LEVEL', {
  providedIn: 'root',
  factory: () => (environment.production ? 'INFO' : 'DEBUG'),
});

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private logger = log.getLogger('app');

  constructor(@Inject(LOG_LEVEL) private minLevel: log.LogLevelDesc) {
    this.logger.setLevel(minLevel);
  }

  debug(message: string): void {
    this.logger.debug(this.format(message));
  }

  info(message: string): void {
    this.logger.info(this.format(message));
  }

  warn(message: string): void {
    this.logger.warn(this.format(message));
  }

  error(message: string): void {
    this.logger.error(this.format(message));
  }

  private format(message: string): string {
    const timestamp = new Date().toISOString();
    // @ts-ignore: loglevel stores current level as number internally
    const levelName = log.levels[this.logger.getLevel()];
    return `[${timestamp}] [${levelName}] ${message}`;
  }
}
