import { Component, Input } from '@angular/core';
import { Hero } from '../interfaces/hero.interface'; 

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent {
  @Input() heroes!: Hero[];
}
