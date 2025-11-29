import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // import correcto

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
  private apiUrl = environment.apiBaseUrl; // usa la URL del environment
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // ==========================
  // Métodos para Estudiantes
  // ==========================
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`, { headers: this.headers });
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student, { headers: this.headers });
  }

  updateStudent(ru: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${ru}`, student, { headers: this.headers });
  }

  deleteStudent(ru: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${ru}`, { headers: this.headers });
  }

  // ==========================
  // Métodos para Mochilas
  // ==========================
  getMochilas(): Observable<Mochila[]> {
    return this.http.get<Mochila[]>(`${this.apiUrl}/mochilas`, { headers: this.headers });
  }

  createMochila(mochila: Mochila): Observable<Mochila> {
    return this.http.post<Mochila>(`${this.apiUrl}/mochilas`, mochila, { headers: this.headers });
  }

  updateMochila(id: number, mochila: Mochila): Observable<Mochila> {
    return this.http.put<Mochila>(`${this.apiUrl}/mochilas/${id}`, mochila, { headers: this.headers });
  }

  deleteMochila(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/mochilas/${id}`, { headers: this.headers });
  }
}
