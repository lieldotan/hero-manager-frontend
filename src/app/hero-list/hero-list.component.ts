import { Component, Input } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  @Input() heroes!: Hero[];
  _contrastCtx: CanvasRenderingContext2D | null = null;

  getContrastColor(colorStr: string): 'black' | 'white' {
    if (typeof CSS !== 'undefined' && !CSS.supports('color', colorStr)) {
      return 'black';
    }

    if (!this._contrastCtx) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      this._contrastCtx = canvas.getContext('2d');
    }

    let computed: string;
    try {
      this._contrastCtx!.fillStyle = colorStr;
      computed = (this._contrastCtx!.fillStyle as string).trim().toLowerCase();
    } catch {
      return 'black';
    }

    if (!computed.startsWith('#') || computed.length !== 7) {
      return 'black';
    }

    const r = parseInt(computed.substr(1, 2), 16);
    const g = parseInt(computed.substr(3, 2), 16);
    const b = parseInt(computed.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? 'black' : 'white';
  }
}
