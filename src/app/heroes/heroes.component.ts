import { Component } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { HEROES } from '../mock-heroes';
import { HeroListComponent } from '../hero-list/hero-list.component';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
  standalone: true,
  imports: [HeroListComponent],
})
export class HeroesComponent {
  heroes: Hero[] = HEROES;
}
