import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <nav class="text-sm mb-6">
        <a routerLink="/browse" class="text-primary-600 hover:underline">Explorer</a>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ yearName }}</span>
      </nav>
      
      <h1 class="text-3xl font-bold mb-8">Matières - {{ yearName }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          *ngFor="let subject of subjects"
          [routerLink]="['/subject', subject.slug]"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 class="text-xl font-bold mb-2">{{ subject.name }}</h2>
          <p class="text-gray-600 text-sm">{{ subject.description || 'Aucune description' }}</p>
          <div *ngIf="subject.manual_url" class="mt-2 text-primary-600 text-sm">
            📄 Manuel disponible
          </div>
        </a>
      </div>
    </div>
  `
})
export class SubjectsComponent implements OnInit {
  subjects: any[] = [];
  yearName = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const yearSlug = this.route.snapshot.params['slug'];
    this.apiService.getSubjects(yearSlug).subscribe({
      next: (response) => {
        if (response.data) {
          this.subjects = response.data;
          this.yearName = yearSlug;
        }
      }
    });
  }
}
