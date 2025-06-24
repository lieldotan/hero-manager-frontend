import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  ReactiveFormsModule,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, catchError, finalize, switchMap, tap, map } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero.service';
import { PowerService } from '../../services/power.service';
import { ToastrService } from 'ngx-toastr';

interface HeroFormModel {
  name: string;
  suitColor: string;
  hasCape: boolean;
  lastMission: string;
  isRetired: boolean;
  powers: string[];
}

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero-form.component.html',
  providers: [DatePipe],
})
export class HeroFormComponent implements OnInit {
  @Input() hero: Hero | null = null;
  @Input() existingNames: string[] = [];
  @Output() submitted = new EventEmitter<Hero>();

  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private heroService: HeroService,
    private powerService: PowerService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.isEditMode = !!this.hero;
    this.buildForm();
    if (this.isEditMode && this.hero) {
      this.loadHero(this.hero.id);
    }
  }

  private uniqueNameValidator(names: string[]): ValidatorFn {
    return (ctrl: AbstractControl): ValidationErrors | null => {
      const value = (ctrl.value || '').trim().toLowerCase();
      if (!value) return null;
      const isDuplicate = names
        .map((n) => n.trim().toLowerCase())
        .includes(value);
      return isDuplicate ? { uniqueName: true } : null;
    };
  }

  private buildForm() {
    const nameValidators: ValidatorFn[] = [
      Validators.required,
      this.uniqueNameValidator(this.existingNames),
    ];

    this.form = this.formBuilder.group({
      name: new FormControl('', {
        validators: nameValidators,
      }),
      suitColor: ['#000000', Validators.required],
      hasCape: [false],
      lastMission: ['', Validators.required],
      isRetired: [false],
      powers: this.formBuilder.array<string>([]),
    });
  }
  private loadHero(id: number) {
    this.isLoading = true;
    forkJoin({
      hero: this.heroService.getHero(id),
      powers: this.powerService.getPowers(id),
    })
      .pipe(
        tap(({ hero, powers }) => {
          this.form.patchValue({
            name: hero.name,
            suitColor: hero.suitColor,
            hasCape: hero.hasCape,
            lastMission: this.datePipe.transform(
              hero.lastMission,
              'yyyy-MM-dd'
            ) as string,
            isRetired: hero.isRetired,
          });

          powers.forEach((power) =>
            this.powersArray.push(new FormControl(power.name))
          );

          ['name', 'suitColor', 'hasCape'].forEach((field) =>
            this.form.get(field)?.disable()
          );
          if (hero.isRetired) {
            this.form.get('isRetired')?.disable();
          }
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        error: () => this.toastr.error('Failed to load hero data'),
      });
  }

  get powersArray(): FormArray {
    return this.form.get('powers') as FormArray;
  }

  addPower() {
    this.powersArray.push(new FormControl(''));
  }

  removePower(index: number) {
    this.powersArray.removeAt(index);
  }

  get nameErrors(): string | null {
    const errors = this.form.get('name')?.errors;
    if (!errors) return null;
    if (errors['required']) return 'Name is required';
    if (errors['uniqueName']) return 'That name is already taken';
    return null;
  }

  save() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    const raw = this.form.getRawValue() as HeroFormModel;
    const payload = {
      name: raw.name,
      suitColor: raw.suitColor,
      hasCape: raw.hasCape,
      lastMission: raw.lastMission,
      isRetired: raw.isRetired,
      powers: raw.powers,
    };

    if (!this.isEditMode) {
      this.heroService
        .createHero(payload)
        .pipe(
          switchMap((response) =>
            raw.isRetired
              ? this.heroService
                  .retireHero(response.id)
                  .pipe(map(() => response))
              : of(response)
          ),
          switchMap((response) =>
            this.powerService
              .updatePowers(response.id, raw.powers)
              .pipe(map(() => response))
          ),
          finalize(() => (this.isSaving = false)),
          catchError((error) => {
            this.toastr.error('Failed to create hero');
            throw error;
          })
        )
        .subscribe((response) => {
          const finalHero: Hero = {
            id: response.id,
            name: raw.name,
            suitColor: raw.suitColor,
            hasCape: raw.hasCape,
            lastMission: raw.lastMission,
            isRetired: raw.isRetired,
            powers: raw.powers,
          };

          this.toastr.success(
            raw.isRetired
              ? 'Hero created and retired successfully'
              : 'Hero created successfully'
          );
          this.activeModal.close(finalHero);
          this.submitted.emit(finalHero);
        });
    } else {
      const heroId = this.hero!.id;

      this.heroService
        .updateLastMission(heroId, raw.lastMission)
        .pipe(
          switchMap(() =>
            raw.isRetired ? this.heroService.retireHero(heroId) : of(void 0)
          ),
          switchMap(() => this.powerService.updatePowers(heroId, raw.powers)),
          finalize(() => (this.isSaving = false)),
          catchError((error) => {
            this.toastr.error('Failed to save changes');
            throw error;
          })
        )
        .subscribe(() => {
          const updatedHero: Hero = {
            ...this.hero!,
            lastMission: raw.lastMission,
            isRetired: raw.isRetired,
            powers: raw.powers,
          };

          this.toastr.success('Hero updated successfully');
          this.activeModal.close(updatedHero);
          this.submitted.emit(updatedHero);
        });
    }
  }
}
