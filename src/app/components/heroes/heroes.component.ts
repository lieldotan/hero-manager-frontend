import { Component } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero.service';
import { HeroListComponent } from '../hero-list/hero-list.component';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
  standalone: true,
  imports: [HeroListComponent, HeroFormComponent],
})
export class HeroesComponent {
  heroes: Hero[] = [];
  selectedHero: Hero | null = null;

  get heroNames(): string[] {
    return this.heroes.map((h) => h.name);
  }

  constructor(
    private heroService: HeroService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  openHeroModal(hero?: Hero): void {
    this.selectedHero = hero ?? null;
    const modalRef = this.modalService.open(HeroFormComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.hero = this.selectedHero;
    modalRef.componentInstance.existingNames = this.heroNames;

    modalRef.result.then((saved: Hero) => this.getHeroes()).catch(() => {});
  }

  onHeroSubmitted(_: Hero) {
    this.getHeroes();
  }
}
