import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Browse endpoints
  getLevels(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/levels`);
  }

  getYears(levelSlug: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/levels/${levelSlug}/years`);
  }

  getSubjects(yearSlug?: string): Observable<ApiResponse<any[]>> {
    if (yearSlug) {
      return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/years/${yearSlug}/subjects`);
    }
    // For studio - get all subjects
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/studio/subjects`);
  }

  // Studio endpoints
  getAllSubjects(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/studio/subjects`);
  }

  getAllLessons(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/studio/lessons`);
  }

  createSubject(subject: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/studio/subjects`, subject);
  }

  createLesson(lesson: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/studio/lessons`, lesson);
  }

  createSession(session: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/studio/sessions`, session);
  }

  createExercise(exercise: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/studio/exercises`, exercise);
  }

  uploadManual(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/studio/manuals`, formData);
  }

  // Subject endpoints
  getSubject(subjectSlug: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/subjects/${subjectSlug}`);
  }

  // Lesson endpoints
  getLesson(lessonSlug: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/lessons/${lessonSlug}`);
  }

  // Interactions
  vote(targetType: string, targetId: number, value: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/vote`, {
      targetType,
      targetId,
      value
    });
  }

  getComments(targetType: string, targetId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/comments?targetType=${targetType}&targetId=${targetId}`);
  }

  createComment(targetType: string, targetId: number, body: string, parentId?: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/comments`, {
      targetType,
      targetId,
      body,
      parentId
    });
  }

  deleteComment(commentId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/comments/${commentId}`);
  }

  // Activity
  recordActivity(kind: string, targetType?: string, targetId?: number, valueInt?: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/activity`, {
      kind,
      targetType,
      targetId,
      valueInt
    });
  }

  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/activity/dashboard/me`);
  }

  // AI Assistant
  askAssistant(subjectSlug: string, question: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/assistant/ask`, {
      subjectSlug,
      question
    });
  }
}
