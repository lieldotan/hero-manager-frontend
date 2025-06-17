import { Component } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent {
  heroes: Hero[] = HEROES;
}
