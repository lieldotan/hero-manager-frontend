import {
  Component,
  input,
  Input,
  signal,
  computed,
} from '@angular/core';
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
      .filter(h => this.showRetired() || !h.isRetired)
      .filter(h => {
        const parts = [
          h.name,
          h.suitColor,
          h.hasCape ? 'yes' : 'no',
          h.isRetired ? 'yes' : 'no',
          new Date(h.lastMission).toLocaleDateString(),
        ];
        if (!term) return true;
        return parts.some(p => p.toLowerCase().includes(term));
      });
  });

  getContrastColor(colorStr: string): 'black' | 'white' {
    return getContrastColor(colorStr);
  }
}
