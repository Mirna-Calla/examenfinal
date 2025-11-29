import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { StudentService } from './services/student.service';

// Mock completo del StudentService
class MockStudentService {
  getStudents = jasmine.createSpy('getStudents').and.returnValue({ subscribe: (callbacks: any) => {
    callbacks.next?.([]);
    callbacks.complete?.();
  }});
  
  getMochilas = jasmine.createSpy('getMochilas').and.returnValue({ subscribe: (callbacks: any) => {
    callbacks.next?.([]);
    callbacks.complete?.();
  }});
  
  createStudent = jasmine.createSpy('createStudent');
  updateStudent = jasmine.createSpy('updateStudent');
  deleteStudent = jasmine.createSpy('deleteStudent');
  createMochila = jasmine.createSpy('createMochila');
  updateMochila = jasmine.createSpy('updateMochila');
  deleteMochila = jasmine.createSpy('deleteMochila');
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentService, useClass: MockStudentService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the correct title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Sistema Estudiantil - Versión Corregida');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Verifica el título real que aparece en tu template
    expect(compiled.querySelector('h1')?.textContent).toContain('Sistema de Gestión Estudiantil');
  });
});