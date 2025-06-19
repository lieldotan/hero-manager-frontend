import { Component, Input } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { getContrastColor } from '../../utils/color-utils';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  @Input() heroes!: Hero[];

  getContrastColor(colorStr: string): 'black' | 'white' {
    return getContrastColor(colorStr);
  }
}
