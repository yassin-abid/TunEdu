import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { ActivityService } from './core/services/activity.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <footer class="bg-gray-800 text-white py-6 mt-auto">
        <div class="container mx-auto px-4 text-center">
          <p>&copy; 2025 TunEdu - Plateforme Éducative Tunisienne</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private activityService: ActivityService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Start time tracking if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.activityService.startTimeTracking();
    }

    // Subscribe to auth changes to start/stop tracking
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.activityService.startTimeTracking();
      } else {
        this.activityService.stopTimeTracking();
      }
    });
  }
}
