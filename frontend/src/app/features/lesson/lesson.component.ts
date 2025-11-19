import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ActivityService } from '../../core/services/activity.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <nav class="text-sm mb-6">
        <a routerLink="/browse" class="text-primary-600 hover:underline">Explorer</a>
        <span class="mx-2">/</span>
        <a [routerLink]="['/subject', lesson?.subject_slug]" class="text-primary-600 hover:underline">
          {{ lesson?.subject_name }}
        </a>
        <span class="mx-2">/</span>
        <span class="text-gray-600">{{ lesson?.title }}</span>
      </nav>
      
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold">{{ lesson?.title }}</h1>
          <p class="text-gray-600 mt-2">{{ lesson?.summary }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button (click)="vote(1)" class="btn btn-secondary">
            👍 {{ lesson?.score || 0 }}
          </button>
          <button (click)="vote(-1)" class="btn btn-secondary">
            👎
          </button>
        </div>
      </div>
      
      <!-- Recorded Sessions -->
      <div *ngIf="lesson?.sessions?.length > 0" class="card mb-6">
        <h2 class="text-xl font-bold mb-4">🎥 Vidéos</h2>
        <div class="space-y-4">
          <div *ngFor="let session of lesson.sessions" class="border rounded-lg p-4">
            <h3 class="font-bold mb-2">{{ session.title }}</h3>
            <div class="aspect-video bg-gray-100 rounded-lg mb-2">
              <iframe
                *ngIf="getVideoEmbedUrl(session.video_url)"
                [src]="getVideoEmbedUrl(session.video_url)"
                class="w-full h-full rounded-lg"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <span *ngIf="session.duration_seconds">
                Durée: {{ formatDuration(session.duration_seconds) }}
              </span>
              <span>👍 {{ session.score }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Exercises -->
      <div *ngIf="lesson?.exercises?.length > 0" class="card mb-6">
        <h2 class="text-xl font-bold mb-4">📝 Exercices</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let exercise of lesson.exercises"
            class="border rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold">{{ exercise.title }}</h3>
              <span
                class="px-2 py-1 rounded text-xs"
                [ngClass]="{
                  'bg-green-100 text-green-800': exercise.difficulty === 'EASY',
                  'bg-yellow-100 text-yellow-800': exercise.difficulty === 'MEDIUM',
                  'bg-red-100 text-red-800': exercise.difficulty === 'HARD'
                }"
              >
                {{ exercise.difficulty }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ exercise.description }}</p>
            <div class="flex items-center space-x-2">
              <a
                *ngIf="exercise.file_url"
                [href]="'http://localhost:3000' + exercise.file_url"
                target="_blank"
                (click)="recordExerciseOpen(exercise.id)"
                class="btn btn-primary text-sm"
              >
                Ouvrir
              </a>
              <span class="text-sm text-gray-500">👍 {{ exercise.score }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Comments -->
      <div class="card">
        <h2 class="text-xl font-bold mb-4">💬 Commentaires</h2>
        
        <div class="mb-6">
          <textarea
            [(ngModel)]="newComment"
            class="input min-h-[100px]"
            placeholder="Ajouter un commentaire..."
          ></textarea>
          <button
            (click)="postComment()"
            [disabled]="!newComment"
            class="btn btn-primary mt-2"
          >
            Publier
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            *ngFor="let comment of comments"
            class="border-l-4 border-primary-500 pl-4 py-2"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold">{{ comment.user_email }}</span>
              <span class="text-sm text-gray-500">
                {{ formatDate(comment.created_at) }}
              </span>
            </div>
            <p class="text-gray-700">{{ comment.body }}</p>
          </div>
          
          <p *ngIf="comments.length === 0" class="text-gray-600">
            Aucun commentaire pour le moment.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LessonComponent implements OnInit {
  lesson: any = null;
  comments: any[] = [];
  newComment = '';

  constructor(
    private apiService: ApiService,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.params['slug'];
    this.loadLesson(slug);
    this.loadComments(slug);
  }

  loadLesson(slug: string) {
    this.apiService.getLesson(slug).subscribe({
      next: (response) => {
        if (response.data) {
          this.lesson = response.data;
          this.activityService.recordPageView('lesson', this.lesson.id);
        }
      }
    });
  }

  loadComments(slug: string) {
    // We need lesson ID, so load after lesson is loaded
    setTimeout(() => {
      if (this.lesson) {
        this.apiService.getComments('lesson', this.lesson.id).subscribe({
          next: (response) => {
            if (response.data) {
              this.comments = response.data;
            }
          }
        });
      }
    }, 500);
  }

  vote(value: number) {
    if (this.lesson) {
      this.apiService.vote('lesson', this.lesson.id, value).subscribe({
        next: () => {
          this.lesson.score += value;
        }
      });
    }
  }

  postComment() {
    if (this.newComment && this.lesson) {
      this.apiService.createComment('lesson', this.lesson.id, this.newComment).subscribe({
        next: (response) => {
          if (response.data) {
            this.comments.unshift(response.data);
            this.newComment = '';
          }
        }
      });
    }
  }

  recordExerciseOpen(exerciseId: number) {
    this.activityService.recordExerciseOpen(exerciseId);
  }

  getVideoEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    
    let videoId: string | undefined;
    
    // Convert YouTube watch URL to embed URL (https://www.youtube.com/watch?v=VIDEO_ID)
    if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    // Handle youtu.be short links (https://youtu.be/VIDEO_ID)
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    // Handle already embedded URLs (https://www.youtube.com/embed/VIDEO_ID)
    else if (url.includes('youtube.com/embed/')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    
    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
    }
    
    // Handle Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      if (vimeoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://player.vimeo.com/video/${vimeoId}`
        );
      }
    }
    
    // Return the URL as-is if it's already an embed URL or other format
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
