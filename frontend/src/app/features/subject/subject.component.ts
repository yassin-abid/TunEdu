import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ActivityService } from '../../core/services/activity.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <nav class="text-sm mb-6">
        <a routerLink="/browse" class="text-primary-600 hover:underline">Explorer</a>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ subject?.name }}</span>
      </nav>
      
      <h1 class="text-3xl font-bold mb-8">{{ subject?.name }}</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Manual preview -->
          <div *ngIf="subject?.manual_url" class="card">
            <h2 class="text-xl font-bold mb-4">📚 Manuel scolaire</h2>
            <div class="bg-gray-100 rounded-lg p-4 mb-4" style="height: 500px;">
              <object
                [data]="getManualUrl()"
                type="application/pdf"
                class="w-full h-full"
              >
                <p>
                  Votre navigateur ne peut pas afficher le PDF.
                  <a [href]="subject.manual_url" download class="text-primary-600 hover:underline">
                    Télécharger le manuel
                  </a>
                </p>
              </object>
            </div>
            <a [href]="subject.manual_url" download class="btn btn-primary">
              Télécharger le PDF
            </a>
          </div>
          
          <!-- Lessons list -->
          <div class="card">
            <h2 class="text-xl font-bold mb-4">📖 Leçons</h2>
            <div *ngIf="subject?.lessons?.length > 0" class="space-y-3">
              <a
                *ngFor="let lesson of subject.lessons"
                [routerLink]="['/lesson', lesson.slug]"
                class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-bold">{{ lesson.title }}</h3>
                    <p class="text-sm text-gray-600">{{ lesson.summary }}</p>
                  </div>
                  <span class="text-sm text-gray-500">👍 {{ lesson.score }}</span>
                </div>
              </a>
            </div>
            <p *ngIf="!subject?.lessons?.length" class="text-gray-600">
              Aucune leçon disponible pour le moment.
            </p>
          </div>
        </div>
        
        <!-- AI Assistant sidebar -->
        <div class="lg:col-span-1">
          <div class="card sticky top-4">
            <h2 class="text-xl font-bold mb-4">🤖 Assistant IA</h2>
            <p class="text-sm text-gray-600 mb-4">
              Posez vos questions sur la matière (basé sur le manuel)
            </p>
            
            <div class="mb-4">
              <textarea
                [(ngModel)]="aiQuestion"
                class="input min-h-[100px]"
                placeholder="Votre question..."
              ></textarea>
            </div>
            
            <button
              (click)="askAssistant()"
              [disabled]="!aiQuestion || aiLoading"
              class="btn btn-primary w-full mb-4"
            >
              {{ aiLoading ? 'Envoi...' : 'Envoyer' }}
            </button>
            
            <div *ngIf="aiResponse" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm">{{ aiResponse }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubjectComponent implements OnInit {
  subject: any = null;
  aiQuestion = '';
  aiResponse = '';
  aiLoading = false;

  constructor(
    private apiService: ApiService,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.params['slug'];
    this.apiService.getSubject(slug).subscribe({
      next: (response) => {
        if (response.data) {
          this.subject = response.data;
          this.activityService.recordPageView('subject', this.subject.id);
        }
      }
    });
  }

  getManualUrl(): SafeResourceUrl {
    const baseUrl = 'http://localhost:3000';
    return this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + this.subject.manual_url);
  }

  askAssistant() {
    if (!this.aiQuestion) return;
    
    this.aiLoading = true;
    this.apiService.askAssistant(this.subject.slug, this.aiQuestion).subscribe({
      next: (response) => {
        if (response.data) {
          this.aiResponse = response.data.answer;
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiResponse = 'Une erreur est survenue.';
        this.aiLoading = false;
      }
    });
  }
}
