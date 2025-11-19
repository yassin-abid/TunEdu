import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Studio Administrateur</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a routerLink="/studio/subject" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">📚 Ajouter une matière</h2>
          <p class="text-gray-600">Créer une nouvelle matière pour une année</p>
        </a>
        
        <a routerLink="/studio/lesson" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">📖 Créer une leçon</h2>
          <p class="text-gray-600">Ajouter une nouvelle leçon à une matière</p>
        </a>
        
        <a routerLink="/studio/session" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">🎥 Ajouter une vidéo</h2>
          <p class="text-gray-600">Ajouter une session enregistrée à une leçon</p>
        </a>
        
        <a routerLink="/studio/exercise" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">📝 Ajouter un exercice</h2>
          <p class="text-gray-600">Créer un nouvel exercice pour une leçon</p>
        </a>
        
        <a routerLink="/studio/manual" class="card hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">📚 Téléverser un manuel</h2>
          <p class="text-gray-600">Ajouter un manuel PDF à une matière</p>
        </a>
      </div>
      
      <div class="card mt-8">
        <h2 class="text-xl font-bold mb-4">ℹ️ Information</h2>
        <p class="text-gray-700">
          Utilisez le studio pour gérer le contenu éducatif. Vous pouvez créer des leçons,
          ajouter des vidéos, créer des exercices et téléverser des manuels scolaires.
        </p>
      </div>
    </div>
  `
})
export class StudioComponent {}
