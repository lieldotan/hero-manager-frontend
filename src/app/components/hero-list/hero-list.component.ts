import { Component, input, Input, signal, computed } from '@angular/core';
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

  filter = signal('');

  showRetired = signal(false);

  filteredHeroes = computed(() => {
    const term = this.filter().trim().toLowerCase();
    return this.heroes()
      .filter((hero) => this.showRetired() || !hero.isRetired)
      .filter((hero) => {
        const parts = [
          hero.name,
          hero.suitColor,
          new Date(hero.lastMission).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        ];
        if (!term) return true;
        return parts.some((part) => part.toLowerCase().includes(term));
      });
  });

  public getContrastColor = getContrastColor;
}
