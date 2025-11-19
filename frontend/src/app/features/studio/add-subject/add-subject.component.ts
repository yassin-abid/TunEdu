import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-subject',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">📚 Ajouter une matière</h1>
          <a routerLink="/studio" class="btn-secondary">← Retour</a>
        </div>

        <div class="card">
          <form [formGroup]="subjectForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Niveau *</label>
              <select formControlName="level_id" (change)="onLevelChange()" class="input">
                <option value="">Sélectionner un niveau</option>
                <option *ngFor="let level of levels" [value]="level.id">
                  {{ level.name }}
                </option>
              </select>
              <p *ngIf="subjectForm.get('level_id')?.touched && subjectForm.get('level_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                Le niveau est requis
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Année *</label>
              <select formControlName="class_year_id" class="input" [disabled]="!years.length">
                <option value="">Sélectionner une année</option>
                <option *ngFor="let year of years" [value]="year.id">
                  {{ year.name }}
                </option>
              </select>
              <p *ngIf="subjectForm.get('class_year_id')?.touched && subjectForm.get('class_year_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                L'année est requise
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Nom de la matière *</label>
              <input type="text" formControlName="name" class="input" 
                     placeholder="Ex: Mathématiques">
              <p *ngIf="subjectForm.get('name')?.touched && subjectForm.get('name')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                Le nom est requis
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Description</label>
              <textarea formControlName="description" class="input" rows="4"
                        placeholder="Description de la matière..."></textarea>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {{ error }}
            </div>

            <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Matière ajoutée avec succès!
            </div>

            <div class="flex gap-3">
              <button type="submit" [disabled]="subjectForm.invalid || loading" 
                      class="btn-primary flex-1">
                <span *ngIf="loading">⏳ Ajout en cours...</span>
                <span *ngIf="!loading">✅ Ajouter la matière</span>
              </button>
              <a routerLink="/studio" class="btn-secondary">Annuler</a>
            </div>
          </form>
        </div>

        <div class="card mt-6 bg-blue-50 border-blue-200">
          <h3 class="font-bold mb-2">💡 Information</h3>
          <p class="text-gray-700">
            Sélectionnez d'abord le niveau (Primaire, Collège, ou Lycée), puis l'année scolaire correspondante.
            Vous pourrez ensuite ajouter des leçons à cette matière.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AddSubjectComponent implements OnInit {
  subjectForm: FormGroup;
  levels: any[] = [];
  years: any[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      level_id: ['', Validators.required],
      class_year_id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadLevels();
  }

  loadLevels() {
    this.apiService.getLevels().subscribe({
      next: (response) => {
        if (response.data) {
          this.levels = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading levels:', err);
        this.error = 'Erreur lors du chargement des niveaux.';
      }
    });
  }

  onLevelChange() {
    const levelId = this.subjectForm.get('level_id')?.value;
    if (levelId) {
      // Find the level to get its slug
      const level = this.levels.find(l => l.id == levelId);
      if (level) {
        this.apiService.getYears(level.slug).subscribe({
          next: (response) => {
            if (response.data) {
              this.years = response.data;
              this.subjectForm.patchValue({ class_year_id: '' });
            }
          },
          error: (err) => {
            console.error('Error loading years:', err);
            this.error = 'Erreur lors du chargement des années.';
          }
        });
      }
    } else {
      this.years = [];
      this.subjectForm.patchValue({ class_year_id: '' });
    }
  }

  onSubmit() {
    if (this.subjectForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.apiService.createSubject(this.subjectForm.value).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.subjectForm.reset();
        this.years = [];
        setTimeout(() => {
          this.router.navigate(['/studio']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors de l\'ajout de la matière';
      }
    });
  }
}
