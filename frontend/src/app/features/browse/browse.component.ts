import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Explorer le programme</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          *ngFor="let level of levels"
          [routerLink]="['/browse', level.slug]"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 class="text-2xl font-bold mb-2">{{ level.name }}</h2>
          <p class="text-gray-600">{{ level.year_count }} années</p>
        </a>
      </div>
      
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-600">Chargement...</p>
      </div>
    </div>
  `
})
export class BrowseComponent implements OnInit {
  levels: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLevels().subscribe({
      next: (response) => {
        if (response.data) {
          this.levels = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
