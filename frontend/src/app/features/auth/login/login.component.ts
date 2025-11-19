import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="card max-w-md w-full">
        <h1 class="text-3xl font-bold text-center mb-6">Connexion</h1>
        
        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
            [disabled]="!loginForm.valid || loading"
            class="btn btn-primary w-full"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        
        <p class="text-center mt-4 text-gray-600">
          Pas de compte ?
          <a routerLink="/auth/register" class="text-primary-600 hover:underline">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.error) {
            this.error = response.error;
            this.loading = false;
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error = 'Erreur de connexion. Veuillez réessayer.';
          this.loading = false;
        }
      });
    }
  }
}
