import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private isProd = environment.production;

  log(message: string, level: LogLevel = 'INFO'): void {
    if (this.isProd && level === 'DEBUG') {
      return;
    }

    const timestamp = new Date().toISOString();
    switch (level) {
      case 'DEBUG':
      case 'INFO':
        console.log(`[${timestamp}] [${level}] ${message}`);
        break;
      case 'WARN':
        console.warn(`[${timestamp}] [${level}] ${message}`);
        break;
      case 'ERROR':
        console.error(`[${timestamp}] [${level}] ${message}`);
        break;
    }
  }
}
