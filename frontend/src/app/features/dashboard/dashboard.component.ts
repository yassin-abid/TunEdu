import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ActivityService } from '../../core/services/activity.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="text-sm text-gray-600 mb-2">Temps aujourd'hui</div>
          <div class="text-3xl font-bold text-primary-600">
            {{ formatTime(stats?.timeToday || 0) }}
          </div>
        </div>
        
        <div class="card">
          <div class="text-sm text-gray-600 mb-2">Temps cette semaine</div>
          <div class="text-3xl font-bold text-primary-600">
            {{ formatTime(stats?.timeWeek || 0) }}
          </div>
        </div>
        
        <div class="card">
          <div class="text-sm text-gray-600 mb-2">Leçons consultées</div>
          <div class="text-3xl font-bold text-primary-600">
            {{ stats?.lessonsViewed || 0 }}
          </div>
        </div>
        
        <div class="card">
          <div class="text-sm text-gray-600 mb-2">Exercices ouverts</div>
          <div class="text-3xl font-bold text-primary-600">
            {{ stats?.exercisesOpened || 0 }}
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Actions rapides</h2>
        <div class="flex flex-wrap gap-4">
          <a routerLink="/browse" class="btn btn-primary">
            Explorer les cours
          </a>
          <button class="btn btn-secondary">
            Reprendre où j'en étais
          </button>
        </div>
      </div>
      
      <div class="card mt-6">
        <h2 class="text-xl font-bold mb-4">Bienvenue sur TunEdu</h2>
        <p class="text-gray-700">
          Explorez le programme tunisien complet : Primaire, Collège et Lycée.
          Accédez aux manuels, vidéos de cours, exercices et bien plus encore !
        </p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = null;

  constructor(
    private apiService: ApiService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.activityService.recordPageView();
    this.loadStats();
  }

  loadStats() {
    this.apiService.getDashboard().subscribe({
      next: (response) => {
        if (response.data) {
          this.stats = response.data;
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
