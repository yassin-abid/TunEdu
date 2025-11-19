import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-add-manual',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold">📚 Téléverser un manuel</h1>
          <a routerLink="/studio" class="btn-secondary">← Retour</a>
        </div>

        <div class="card">
          <form [formGroup]="manualForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Matière *</label>
              <select formControlName="subject_id" class="input">
                <option value="">Sélectionner une matière</option>
                <option *ngFor="let subject of subjects" [value]="subject.id">
                  {{ subject.level_name }} - {{ subject.year_name }} - {{ subject.name }}
                </option>
              </select>
              <p *ngIf="manualForm.get('subject_id')?.touched && manualForm.get('subject_id')?.errors?.['required']" 
                 class="text-red-500 text-sm mt-1">
                La matière est requise
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Fichier PDF du manuel *</label>
              <input type="file" (change)="onFileSelect($event)" accept=".pdf" 
                     class="input cursor-pointer">
              <p *ngIf="!selectedFile && manualForm.get('file')?.touched" 
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
              Manuel téléversé avec succès!
            </div>

            <div class="flex gap-3">
              <button type="submit" [disabled]="manualForm.invalid || !selectedFile || loading" 
                      class="btn-primary flex-1">
                <span *ngIf="loading">⏳ Téléversement en cours...</span>
                <span *ngIf="!loading">✅ Téléverser le manuel</span>
              </button>
              <a routerLink="/studio" class="btn-secondary">Annuler</a>
            </div>
          </form>
        </div>

        <div class="card mt-6 bg-blue-50 border-blue-200">
          <h3 class="font-bold mb-2">💡 Information</h3>
          <p class="text-gray-700">
            Le manuel scolaire sera associé à la matière sélectionnée et accessible depuis la page de la matière.
          </p>
        </div>
      </div>
    </div>
  `
})
export class AddManualComponent implements OnInit {
  manualForm: FormGroup;
  subjects: any[] = [];
  selectedFile: File | null = null;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.manualForm = this.fb.group({
      subject_id: ['', Validators.required],
      file: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.apiService.getAllSubjects().subscribe({
      next: (response) => {
        if (response.data) {
          this.subjects = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
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
      this.manualForm.patchValue({ file: file.name });
      this.error = '';
    } else {
      this.error = 'Veuillez sélectionner un fichier PDF valide';
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.manualForm.invalid || !this.selectedFile) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const formData = new FormData();
    formData.append('subject_id', this.manualForm.get('subject_id')?.value);
    formData.append('file', this.selectedFile);

    this.apiService.uploadManual(formData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.manualForm.reset();
        this.selectedFile = null;
        setTimeout(() => {
          this.router.navigate(['/studio']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Erreur lors du téléversement du manuel';
      }
    });
  }
}
