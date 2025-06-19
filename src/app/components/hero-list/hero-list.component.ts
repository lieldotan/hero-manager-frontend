import { Component, input, Input } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { getContrastColor } from '../../utils/color-utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
  standalone: true,
  imports: [DatePipe],
})
export class HeroListComponent {
  heroes = input.required<Hero[]>();

  getContrastColor(colorStr: string): 'black' | 'white' {
    return getContrastColor(colorStr);
  }
}
