import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-years',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <nav class="text-sm mb-6">
        <a routerLink="/browse" class="text-primary-600 hover:underline">Explorer</a>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ levelName }}</span>
      </nav>
      
      <h1 class="text-3xl font-bold mb-8">{{ levelName }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          *ngFor="let year of years"
          [routerLink]="['/browse', 'year', year.slug]"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 class="text-xl font-bold">{{ year.name }}</h2>
        </a>
      </div>
    </div>
  `
})
export class YearsComponent implements OnInit {
  years: any[] = [];
  levelName = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const levelSlug = this.route.snapshot.params['slug'];
    this.apiService.getYears(levelSlug).subscribe({
      next: (response) => {
        if (response.data) {
          this.years = response.data;
          this.levelName = levelSlug.charAt(0).toUpperCase() + levelSlug.slice(1);
        }
      }
    });
  }
}
