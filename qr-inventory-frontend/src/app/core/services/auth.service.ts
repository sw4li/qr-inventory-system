import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(username: string, email: string, password: string): Observable<any> {
    const body = {
      username,
      email,
      password,
    };
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      email,
      password,
    };
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((response: any) => {
        const token = response?.data?.token;
        sessionStorage.setItem('token', token);
        this.tokenSubject.next(token);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getCurrentUser(): Observable<any> {
    // const token = sessionStorage.getItem('token');
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });
    return this.http.get(`${this.apiUrl}/me`);
  }
}
