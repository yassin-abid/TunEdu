import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-exercise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">📝 Ajouter un exercice</h1>
          <a routerLink="/studio" class="btn-secondary">← Retour</a>
        </div>

        <div class="card">
          <form [formGroup]="exerciseForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Leçon *</label>
              <select formControlName="lesson_id" class="input">
                <option value="">Sélectionner une leçon</option>
                <option *ngFor="let lesson of lessons" [value]="lesson.id">
                  {{ lesson.level_name }} - {{ lesson.year_name }} - {{ lesson.subject_name }} : {{ lesson.title }}
                </option>
              </select>
              <p *ngIf="exerciseForm.get('lesson_id')?.touched && exerciseForm.get('lesson_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                La leçon est requise
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Titre *</label>
              <input type="text" formControlName="title" class="input" 
                     placeholder="Ex: Exercices sur les fractions">
              <p *ngIf="exerciseForm.get('title')?.touched && exerciseForm.get('title')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                Le titre est requis
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Description</label>
              <textarea formControlName="description" class="input" rows="4"
                        placeholder="Description de l'exercice..."></textarea>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Difficulté *</label>
              <select formControlName="difficulty" class="input">
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Fichier PDF *</label>
              <input type="file" (change)="onFileSelect($event)" accept=".pdf" 
                     class="input cursor-pointer">
              <p *ngIf="!selectedFile && exerciseForm.get('file')?.touched" 
                 class="text-red-500 text-sm mt-1">
                Le fichier PDF est requis
              </p>
              <p class="text-gray-500 text-sm mt-1">
                Fichier PDF uniquement (max 50 MB)
              </p>
              <p *ngIf="selectedFile" class="text-green-600 text-sm mt-1">
                ✓ Fichier sélectionné: {{ selectedFile.name }}
              </p>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {{ error }}
            </div>

            <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              Exercice ajouté avec succès!
            </div>

            <div class="flex gap-3">
              <button type="submit" [disabled]="exerciseForm.invalid || !selectedFile || loading" 
                      class="btn-primary flex-1">
                <span *ngIf="loading">⏳ Téléversement en cours...</span>
                <span *ngIf="!loading">✅ Ajouter l'exercice</span>
              </button>
              <a routerLink="/studio" class="btn-secondary">Annuler</a>
            </div>
          </form>
        </div>

        <div class="card mt-6 bg-blue-50 border-blue-200">
          <h3 class="font-bold mb-2">💡 Conseil</h3>
          <p class="text-gray-700">
            Assurez-vous que votre fichier PDF est bien formaté et ne dépasse pas 50 MB.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AddExerciseComponent implements OnInit {
  exerciseForm: FormGroup;
  lessons: any[] = [];
  selectedFile: File | null = null;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.exerciseForm = this.fb.group({
      lesson_id: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      difficulty: ['moyen', Validators.required],
      file: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
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

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 50 * 1024 * 1024) {
        this.error = 'Le fichier ne doit pas dépasser 50 MB';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.exerciseForm.patchValue({ file: file.name });
      this.error = '';
    } else {
      this.error = 'Veuillez sélectionner un fichier PDF valide';
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.exerciseForm.invalid || !this.selectedFile) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const formData = new FormData();
    formData.append('lesson_id', this.exerciseForm.get('lesson_id')?.value);
    formData.append('title', this.exerciseForm.get('title')?.value);
    formData.append('description', this.exerciseForm.get('description')?.value || '');
    formData.append('difficulty', this.exerciseForm.get('difficulty')?.value);
    formData.append('file', this.selectedFile);

    this.apiService.createExercise(formData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.exerciseForm.reset();
        this.selectedFile = null;
        setTimeout(() => {
          this.router.navigate(['/studio']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors de l\'ajout de l\'exercice';
      }
    });
  }
}
