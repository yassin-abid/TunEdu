import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-lesson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">📖 Créer une leçon</h1>
          <a routerLink="/studio" class="btn-secondary">← Retour</a>
        </div>

        <!-- Debug Info -->
        <div class="card mb-4 bg-gray-100">
          <h3 class="font-bold mb-2">🔍 Debug Info</h3>
          <p>Subjects loaded: {{ subjects.length }}</p>
          <p>Auth token: {{ hasToken() ? '✅ Present' : '❌ Missing' }}</p>
          <button (click)="testAPI()" class="btn-secondary mt-2">Test API Connection</button>
        </div>

        <div class="card">
          <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Matière *</label>
              <select formControlName="subject_id" class="input">
                <option value="">Sélectionner une matière</option>
                <option *ngFor="let subject of subjects" [value]="subject.id">
                  {{ subject.level_name }} - {{ subject.year_name }} - {{ subject.name }}
                </option>
              </select>
              <p *ngIf="lessonForm.get('subject_id')?.touched && lessonForm.get('subject_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                La matière est requise
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Titre *</label>
              <input type="text" formControlName="title" class="input" 
                     placeholder="Ex: Les fractions">
              <p *ngIf="lessonForm.get('title')?.touched && lessonForm.get('title')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                Le titre est requis
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Description</label>
              <textarea formControlName="description" class="input" rows="4"
                        placeholder="Description de la leçon..."></textarea>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {{ error }}
            </div>

            <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Leçon créée avec succès!
            </div>

            <div class="flex gap-3">
              <button type="submit" [disabled]="lessonForm.invalid || loading" 
                      class="btn-primary flex-1">
                <span *ngIf="loading">⏳ Création en cours...</span>
                <span *ngIf="!loading">✅ Créer la leçon</span>
              </button>
              <a routerLink="/studio" class="btn-secondary">Annuler</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AddLessonComponent implements OnInit {
  lessonForm: FormGroup;
  subjects: any[] = [];
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.lessonForm = this.fb.group({
      subject_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadSubjects();
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  testAPI() {
    console.log('=== API TEST ===');
    console.log('Token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    console.log('API URL:', 'http://localhost:3000/api/v1/studio/subjects');
    this.loadSubjects();
  }

  loadSubjects() {
    this.apiService.getAllSubjects().subscribe({
      next: (response) => {
        console.log('Subjects response:', response);
        if (response.data) {
          this.subjects = response.data;
          console.log('Loaded subjects:', this.subjects.length);
        } else {
          console.warn('No data in response:', response);
        }
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.error = 'Erreur lors du chargement des matières. Vérifiez que le serveur backend est démarré.';
      }
    });
  }

  onSubmit() {
    if (this.lessonForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.apiService.createLesson(this.lessonForm.value).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.lessonForm.reset();
        setTimeout(() => {
          this.router.navigate(['/studio']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors de la création de la leçon';
      }
    });
  }
}
