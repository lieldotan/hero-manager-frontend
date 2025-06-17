import { Component, Input, Signal, signal } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
  standalone: true,
  imports: [DatePipe],
})
export class HeroListComponent {
  private _heroes = signal<Hero[]>([]);
  readonly heroes$: Signal<Hero[]> = this._heroes;

  @Input() set heroes(value: Hero[]) {
    this._heroes.set(value ?? []);
  }
}
