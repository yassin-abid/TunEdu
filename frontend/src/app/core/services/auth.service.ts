import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    user: User;
  } | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const token = this.getToken();
    if (token) {
      // Verify token by fetching current user
      this.getCurrentUser().subscribe({
        next: (response) => {
          if (response.data) {
            this.currentUserSubject.next(response.data);
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
      email,
      password,
      firstName,
      lastName
    }).pipe(
      tap(response => {
        if (response.data) {
          this.setToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.data) {
          this.setToken(response.data.accessToken);
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  getCurrentUser(): Observable<{ data: User | null; error: string | null }> {
    return this.http.get<{ data: User | null; error: string | null }>(`${environment.apiUrl}/auth/me`);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN' || user?.role === 'TEACHER';
  }
}
