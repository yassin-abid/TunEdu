import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">🎥 Ajouter une vidéo</h1>
          <a routerLink="/studio" class="btn-secondary">← Retour</a>
        </div>

        <div class="card">
          <form [formGroup]="sessionForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Leçon *</label>
              <select formControlName="lesson_id" class="input">
                <option value="">Sélectionner une leçon</option>
                <option *ngFor="let lesson of lessons" [value]="lesson.id">
                  {{ lesson.level_name }} - {{ lesson.year_name }} - {{ lesson.subject_name }} : {{ lesson.title }}
                </option>
              </select>
              <p *ngIf="sessionForm.get('lesson_id')?.touched && sessionForm.get('lesson_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                La leçon est requise
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Titre *</label>
              <input type="text" formControlName="title" class="input" 
                     placeholder="Ex: Introduction aux fractions">
              <p *ngIf="sessionForm.get('title')?.touched && sessionForm.get('title')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                Le titre est requis
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">URL YouTube *</label>
              <input type="text" formControlName="video_url" class="input" 
                     placeholder="https://www.youtube.com/watch?v=...">
              <p *ngIf="sessionForm.get('video_url')?.touched && sessionForm.get('video_url')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                L'URL YouTube est requise
              </p>
              <p class="text-gray-500 text-sm mt-1">
                Copiez l'URL complète depuis YouTube (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Durée (minutes)</label>
              <input type="number" formControlName="duration_minutes" class="input" 
                     placeholder="45">
              <p class="text-gray-500 text-sm mt-1">
                Durée optionnelle de la vidéo en minutes
              </p>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {{ error }}
            </div>

            <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Vidéo ajoutée avec succès!
            </div>

            <div class="flex gap-3">
              <button type="submit" [disabled]="sessionForm.invalid || loading" 
                      class="btn-primary flex-1">
                <span *ngIf="loading">⏳ Ajout en cours...</span>
                <span *ngIf="!loading">✅ Ajouter la vidéo</span>
              </button>
              <a routerLink="/studio" class="btn-secondary">Annuler</a>
            </div>
          </form>
        </div>

        <div class="card mt-6 bg-blue-50 border-blue-200">
          <h3 class="font-bold mb-2">💡 Conseil</h3>
          <p class="text-gray-700">
            Pour obtenir l'URL YouTube, ouvrez la vidéo sur YouTube, cliquez sur "Partager" puis copiez le lien complet.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AddSessionComponent implements OnInit {
  sessionForm: FormGroup;
  lessons: any[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      lesson_id: ['', Validators.required],
      title: ['', Validators.required],
      video_url: ['', Validators.required],
      duration_minutes: ['']
    });
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    // Load all lessons for the dropdown
    this.apiService.getAllLessons().subscribe({
      next: (response) => {
        console.log('Lessons response:', response);
        if (response.data) {
          this.lessons = response.data;
          console.log('Loaded lessons:', this.lessons.length);
        } else {
          console.warn('No data in response:', response);
        }
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.error = 'Erreur lors du chargement des leçons. Vérifiez que le serveur backend est démarré.';
      }
    });
  }

  onSubmit() {
    if (this.sessionForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.apiService.createSession(this.sessionForm.value).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.sessionForm.reset();
        setTimeout(() => {
          this.router.navigate(['/studio']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors de l\'ajout de la vidéo';
      }
    });
  }
}
