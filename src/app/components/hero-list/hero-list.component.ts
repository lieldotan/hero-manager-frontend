import { Component, EventEmitter, input, Input, Output } from '@angular/core';
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

  @Output() editHero = new EventEmitter<Hero>();

  getContrastColor(colorStr: string): 'black' | 'white' {
    return getContrastColor(colorStr);
  }

  edit(hero: Hero) {
    this.editHero.emit(hero);
  }
}
