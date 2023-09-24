// authService.ts - Angular service for handling authentication

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth/token';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.apiUrl}`, body);
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }
    getUserRole(): string | null {
        const token = this.getToken();
        if (token) {
          // Assuming the token contains the user's role information in some way (e.g., as a claim)
          // You would need to parse the token and extract the role information based on your token structure
          // For simplicity, let's assume the token contains a field called 'role'
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          return decodedToken.role;
        }
        return null;
}
}
