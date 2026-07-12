import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://qr-inventory-system-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/items`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${id}`);
  }

  createItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, item );
  }

  updateItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${id}`, item );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`);
  }
}