import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from './api.service';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService implements OnDestroy {
  private timeTickSubscription?: Subscription;
  private readonly TICK_INTERVAL = 15000; // 15 seconds

  constructor(private apiService: ApiService) {}

  /**
   * Start tracking time spent on the platform
   */
  startTimeTracking(): void {
    if (this.timeTickSubscription) {
      return; // Already tracking
    }

    this.timeTickSubscription = interval(this.TICK_INTERVAL).subscribe(() => {
      this.apiService.recordActivity('TIME_TICK', undefined, undefined, 15).subscribe();
    });
  }

  /**
   * Stop tracking time
   */
  stopTimeTracking(): void {
    if (this.timeTickSubscription) {
      this.timeTickSubscription.unsubscribe();
      this.timeTickSubscription = undefined;
    }
  }

  /**
   * Record a page view
   */
  recordPageView(targetType?: string, targetId?: number): void {
    this.apiService.recordActivity('PAGE_VIEW', targetType, targetId).subscribe();
  }

  /**
   * Record video open
   */
  recordVideoOpen(sessionId: number): void {
    this.apiService.recordActivity('VIDEO_OPEN', 'session', sessionId).subscribe();
  }

  /**
   * Record exercise open
   */
  recordExerciseOpen(exerciseId: number): void {
    this.apiService.recordActivity('EXERCISE_OPEN', 'exercise', exerciseId).subscribe();
  }

  ngOnDestroy(): void {
    this.stopTimeTracking();
  }
}
