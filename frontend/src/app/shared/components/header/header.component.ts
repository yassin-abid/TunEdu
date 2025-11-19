import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="text-2xl font-bold text-primary-600">
              📚 TunEdu
            </a>
            <nav class="hidden md:flex space-x-6" *ngIf="currentUser">
              <a routerLink="/dashboard" class="text-gray-700 hover:text-primary-600">Tableau de bord</a>
              <a routerLink="/browse" class="text-gray-700 hover:text-primary-600">Explorer</a>
              <a routerLink="/studio" *ngIf="isAdmin" class="text-gray-700 hover:text-primary-600">Studio</a>
            </nav>
          </div>
          
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser" class="hidden md:flex items-center space-x-4">
              <span class="text-gray-700">
                {{ currentUser.email }}
              </span>
              <button (click)="logout()" class="btn btn-secondary">
                Déconnexion
              </button>
            </div>
            <div *ngIf="!currentUser" class="space-x-2">
              <a routerLink="/auth/login" class="btn btn-secondary">Connexion</a>
              <a routerLink="/auth/register" class="btn btn-primary">Inscription</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  currentUser: any = null;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
