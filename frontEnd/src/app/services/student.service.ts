import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  ru?: number;
  dni: string;
  name: string;
  lastName: string;
  address: string;
  mochila?: Mochila | null;
  mochilaId?: number;
}

export interface Mochila {
  id?: number;
  marca: string;
  color: string;
  material: string;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = "https://eun-stormlike-tamekia.ngrok-free.dev";
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true'
  });

  constructor(private http: HttpClient) { }

  // Estudiantes
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/api/students`, { headers: this.headers });
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/api/students`, student, { headers: this.headers });
  }

  updateStudent(ru: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/api/students/${ru}`, student, { headers: this.headers });
  }

  deleteStudent(ru: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/students/${ru}`, { headers: this.headers });
  }

  // Mochilas
  getMochilas(): Observable<Mochila[]> {
    return this.http.get<Mochila[]>(`${this.apiUrl}/api/mochilas`, { headers: this.headers });
  }

  createMochila(mochila: Mochila): Observable<Mochila> {
    return this.http.post<Mochila>(`${this.apiUrl}/api/mochilas`, mochila, { headers: this.headers });
  }

  updateMochila(id: number, mochila: Mochila): Observable<Mochila> {
    return this.http.put<Mochila>(`${this.apiUrl}/api/mochilas/${id}`, mochila, { headers: this.headers });
  }

  deleteMochila(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/mochilas/${id}`, { headers: this.headers });
  }
}