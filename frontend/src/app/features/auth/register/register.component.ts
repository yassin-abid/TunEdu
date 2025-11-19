import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="card max-w-md w-full">
        <h1 class="text-3xl font-bold text-center mb-6">Inscription</h1>
        
        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="input"
              placeholder="email@example.com"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 mb-2" for="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="input"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="input"
                placeholder="Nom"
              />
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 mb-2" for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="input"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            [disabled]="!registerForm.valid || loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Inscription...' : 'S\'inscrire' }}
          </button>
        </form>
        
        <p class="text-center mt-4 text-gray-600">
          Déjà inscrit ?
          <a routerLink="/auth/login" class="text-primary-600 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password, firstName, lastName } = this.registerForm.value;
      
      this.authService.register(email, password, firstName, lastName).subscribe({
        next: (response) => {
          if (response.error) {
            this.error = response.error;
            this.loading = false;
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error = 'Erreur d\'inscription. Veuillez réessayer.';
          this.loading = false;
        }
      });
    }
  }
}
