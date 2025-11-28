import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student, Mochila } from './services/student.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sistema Estudiantil - Versión Corregida';
  students: Student[] = [];
  mochilas: Mochila[] = [];

  // 🔍 Propiedades para búsqueda
  searchTerm: string = '';
  searchFilter: string = 'all'; // 'all', 'withBackpack', 'withoutBackpack'
  filteredStudents: Student[] = [];
  
  // Para crear
  newStudent: Student = { 
    dni: '', 
    name: '', 
    lastName: '', 
    address: '', 
    mochilaId: undefined
  };
  
  newMochila: Mochila = {
    marca: '',
    color: '',
    material: '',
    capacidad: 0
  };

  // Para editar
  selectedStudent: Student | null = null;
  selectedMochila: Mochila | null = null;
  isEditingStudent = false;
  isEditingMochila = false;

  // Estados de carga
  isLoading: boolean = false;

  constructor(
    private studentService: StudentService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    console.log('🚀 INICIANDO SISTEMA ESTUDIANTIL...');
    this.loadAllData();
  }

  /**
   * CARGA TODOS LOS DATOS - VERSIÓN CORREGIDA
   */
  loadAllData() {
    this.isLoading = true;
    console.log('🔄 CARGANDO DATOS...');

    // Cargar estudiantes primero (ya vienen con mochilas incluidas)
    this.loadStudents();
  }

  /**
   * CARGA ESTUDIANTES Y PROCESA LAS MOCHILAS - VERSIÓN CORREGIDA
   */
  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (studentsData: Student[]) => {
        console.log('✅ ESTUDIANTES CARGADOS:', studentsData);
        
        // 🔥 CORRECCIÓN CRÍTICA: Los estudiantes ya vienen con mochilas completas
        this.students = studentsData.map(student => {
          // EXTRAER mochilaId DEL OBJETO MOCHILA SI EXISTE
          const mochilaId = student.mochila?.id;
          
          console.log(`🔗 ${student.name} ${student.lastName}:`, {
            tieneMochila: !!student.mochila,
            mochilaId: mochilaId,
            mochilaCompleta: student.mochila
          });

          return {
            ...student,
            mochilaId: mochilaId, // ASIGNAR mochilaId EXPLÍCITAMENTE
            mochila: student.mochila || null
          };
        });

        console.log('🎯 ESTUDIANTES PROCESADOS:', this.students);
        
        // Cargar mochilas por separado para referencia
        this.loadMochilas();
        
        // INICIALIZAR FILTRADOS
        this.filteredStudents = [...this.students];
        
        // EJECUTAR FILTRO INICIAL
        this.filterStudents();
        
        this.isLoading = false;
        
        // DEBUG FINAL
        this.mostrarEstadoFinal();
      },
      error: (error: any) => {
        console.error('❌ ERROR CARGANDO ESTUDIANTES:', error);
        this.isLoading = false;
        this.mostrarErrorSeguro('Error de conexión con el servidor');
      }
    });
  }

  /**
   * CARGA MOCHILAS PARA REFERENCIA
   */
  loadMochilas() {
    this.studentService.getMochilas().subscribe({
      next: (mochilasData: Mochila[]) => {
        console.log('✅ MOCHILAS CARGADAS:', mochilasData);
        this.mochilas = mochilasData || [];
      },
      error: (error: any) => {
        console.error('❌ ERROR CARGANDO MOCHILAS:', error);
      }
    });
  }

  /**
   * FILTRO PRINCIPAL - COMPLETAMENTE CORREGIDO
   */
  filterStudents() {
    console.log('🔍 EJECUTANDO FILTRO:', {
      término: this.searchTerm,
      filtro: this.searchFilter,
      totalEstudiantes: this.students.length
    });

    // DEBUG: Mostrar estado actual de todos los estudiantes
    console.log('📊 ESTADO ACTUAL DE ESTUDIANTES:');
    this.students.forEach(student => {
      console.log(`   ${student.name} ${student.lastName}: mochilaId=${student.mochilaId}, tieneMochilaObj=${!!student.mochila}`);
    });

    // Si no hay búsqueda ni filtro, mostrar todos
    if (!this.searchTerm && this.searchFilter === 'all') {
      this.filteredStudents = [...this.students];
      console.log('✅ Mostrando TODOS los estudiantes:', this.filteredStudents.length);
      return;
    }

    // Aplicar filtros
    this.filteredStudents = this.students.filter(student => {
      // 1. VERIFICAR BÚSQUEDA POR TEXTO
      const searchMatch = this.verificarBusquedaTexto(student);
      
      // 2. VERIFICAR FILTRO POR MOCHILA - VERSIÓN CORREGIDA
      const filterMatch = this.verificarFiltroMochila(student);
      
      // 3. COMBINAR RESULTADOS
      const resultadoFinal = searchMatch && filterMatch;

      console.log(`📋 ${student.name} ${student.lastName}:`, {
        búsqueda: searchMatch,
        filtro: filterMatch,
        resultado: resultadoFinal,
        mochilaId: student.mochilaId,
        tieneMochila: !!student.mochila
      });

      return resultadoFinal;
    });

    this.mostrarResultadosFiltro();
  }

  /**
   * VERIFICA BÚSQUEDA POR TEXTO EN MÚLTIPLES CAMPOS
   */
  private verificarBusquedaTexto(student: Student): boolean {
    if (!this.searchTerm.trim()) return true;

    const termino = this.searchTerm.toLowerCase().trim();
    
    return (
      (student.name && student.name.toLowerCase().includes(termino)) ||
      (student.lastName && student.lastName.toLowerCase().includes(termino)) ||
      (student.dni && student.dni.includes(termino)) ||
      (student.address && student.address.toLowerCase().includes(termino)) ||
      (student.mochila && student.mochila.marca && student.mochila.marca.toLowerCase().includes(termino)) ||
      (student.mochila && student.mochila.color && student.mochila.color.toLowerCase().includes(termino)) ||
      false
    );
  }

  /**
   * VERIFICA FILTRO POR ESTADO DE MOCHILA - VERSIÓN CORREGIDA
   */
  private verificarFiltroMochila(student: Student): boolean {
    switch (this.searchFilter) {
      case 'withBackpack':
        // ✅ CON MOCHILA: debe tener objeto mochila O mochilaId válido
        return (student.mochila !== null && student.mochila !== undefined) || 
               (student.mochilaId !== undefined && student.mochilaId !== null && Number(student.mochilaId) > 0);

      case 'withoutBackpack':
        // ✅ SIN MOCHILA: NO debe tener objeto mochila NI mochilaId válido
        return (student.mochila === null || student.mochila === undefined) && 
               (student.mochilaId === undefined || student.mochilaId === null || Number(student.mochilaId) <= 0);

      case 'all':
      default:
        return true;
    }
  }

  /**
   * MUESTRA RESULTADOS DEL FILTRADO
   */
  private mostrarResultadosFiltro() {
    console.log('🎯 FILTRADO COMPLETADO:');
    console.log('   - Estudiantes encontrados:', this.filteredStudents.length);
    
    if (this.filteredStudents.length === 0) {
      console.log('   - ❌ NO SE ENCONTRARON ESTUDIANTES');
    } else {
      this.filteredStudents.forEach(estudiante => {
        const tieneMochila = estudiante.mochila !== null && estudiante.mochila !== undefined;
        console.log(`   - ✅ ${estudiante.name} ${estudiante.lastName} (${tieneMochila ? 'CON MOCHILA' : 'SIN MOCHILA'})`);
      });
    }
  }

  /**
   * LIMPIAR BÚSQUEDA COMPLETAMENTE
   */
  clearSearch() {
    console.log('🧹 LIMPIANDO BÚSQUEDA...');
    this.searchTerm = '';
    this.searchFilter = 'all';
    this.filterStudents();
  }

  /**
   * MUESTRA ESTADO FINAL DEL SISTEMA
   */
  private mostrarEstadoFinal() {
    console.log('📊 === ESTADO FINAL DEL SISTEMA ===');
    
    // Estadísticas
    const conMochila = this.students.filter(s => s.mochila !== null && s.mochila !== undefined).length;
    const sinMochila = this.students.length - conMochila;
    
    console.log('📈 ESTADÍSTICAS:');
    console.log(`   - Total estudiantes: ${this.students.length}`);
    console.log(`   - Con mochila: ${conMochila}`);
    console.log(`   - Sin mochila: ${sinMochila}`);
    console.log(`   - Total mochilas en sistema: ${this.mochilas.length}`);

    // Lista de estudiantes con su estado
    console.log('👥 DETALLE DE ESTUDIANTES:');
    this.students.forEach(estudiante => {
      const estadoMochila = estudiante.mochila 
        ? `CON MOCHILA (${estudiante.mochila.marca} ${estudiante.mochila.color})` 
        : 'SIN MOCHILA';
      
      console.log(`   - ${estudiante.name} ${estudiante.lastName}: ${estadoMochila}`);
    });

    // Verificar específicamente Nicol Calla
    const nicol = this.students.find(s => 
      s.name?.toLowerCase().includes('nicol') && 
      s.lastName?.toLowerCase().includes('call')
    );
    
    if (nicol) {
      console.log('🔍 INFORMACIÓN ESPECÍFICA - NICOL CALLA:', nicol);
      console.log(`   - Tiene mochila: ${!!nicol.mochila}`);
      console.log(`   - mochilaId: ${nicol.mochilaId}`);
      console.log(`   - Objeto mochila:`, nicol.mochila);
    }
  }

  /**
   * MUESTRA ERRORES DE FORMA SEGURA (SIN ERRORES DE SSR)
   */
  private mostrarErrorSeguro(mensaje: string) {
    console.error('ERROR:', mensaje);
    
    // Solo mostrar alert si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      alert(mensaje);
    }
  }

  // ========== MÉTODOS EXISTENTES (MANTENER) ==========

  createStudent() {
    if (!this.validateStudent(this.newStudent)) return;

    const studentToSend: any = {
      dni: this.newStudent.dni,
      name: this.newStudent.name,
      lastName: this.newStudent.lastName,
      address: this.newStudent.address || ""
    };

    if (this.newStudent.mochilaId) {
      studentToSend.mochila = {
        id: this.newStudent.mochilaId
      };
      console.log('🎒 Asignando mochila ID:', this.newStudent.mochilaId);
    }

    console.log('📤 ENVIANDO AL BACKEND:', studentToSend);

    this.studentService.createStudent(studentToSend).subscribe({
      next: (data: Student) => {
        console.log('✅ ESTUDIANTE CREADO:', data);
        this.loadAllData();
        this.newStudent = { dni: '', name: '', lastName: '', address: '', mochilaId: undefined };
        this.mostrarErrorSeguro('🎓 Estudiante creado exitosamente!');
      },
      error: (error: any) => {
        console.error('❌ ERROR CREANDO:', error);
        console.error('❌ DETALLES:', error.error);
        this.mostrarErrorSeguro('Error: ' + (error.error?.message || error.message));
      }
    });
  }

  createMochila() {
    if (!this.validateMochila(this.newMochila)) return;

    this.studentService.createMochila(this.newMochila).subscribe({
      next: (data: Mochila) => {
        console.log('Mochila creada:', data);
        this.loadAllData();
        this.newMochila = { marca: '', color: '', material: '', capacidad: 0 };
        this.mostrarErrorSeguro('🎒 Mochila creada exitosamente!');
      },
      error: (error: any) => {
        console.error('Error creando mochila:', error);
        this.mostrarErrorSeguro('Error creando mochila: ' + error.message);
      }
    });
  }

  editStudent(student: Student) {
    this.selectedStudent = { ...student };
    this.isEditingStudent = true;
  }

  updateStudent() {
    if (!this.selectedStudent || !this.selectedStudent.ru) return;
    
    if (!this.validateStudent(this.selectedStudent)) return;

    const studentToUpdate: any = {
      dni: this.selectedStudent.dni,
      name: this.selectedStudent.name,
      lastName: this.selectedStudent.lastName,
      address: this.selectedStudent.address || ""
    };

    if (this.selectedStudent.mochilaId) {
      studentToUpdate.mochila = {
        id: this.selectedStudent.mochilaId
      };
      console.log('🎒 Actualizando con mochila ID:', this.selectedStudent.mochilaId);
    } else {
      studentToUpdate.mochila = null;
      console.log('🎒 Quitando mochila');
    }

    console.log('📤 ENVIANDO ACTUALIZACIÓN:', studentToUpdate);

    this.studentService.updateStudent(this.selectedStudent.ru, studentToUpdate).subscribe({
      next: (data: Student) => {
        console.log('✅ ESTUDIANTE ACTUALIZADO:', data);
        this.loadAllData();
        this.cancelEdit();
        this.mostrarErrorSeguro('✅ Estudiante actualizado exitosamente!');
      },
      error: (error: any) => {
        console.error('❌ ERROR ACTUALIZANDO:', error);
        console.error('❌ DETALLES:', error.error);
        this.mostrarErrorSeguro('❌ Error actualizando: ' + (error.error?.message || error.message));
      }
    });
  }

  editMochila(mochila: Mochila) {
    this.selectedMochila = { ...mochila };
    this.isEditingMochila = true;
  }

  updateMochila() {
    if (!this.selectedMochila || !this.selectedMochila.id) return;
    
    if (!this.validateMochila(this.selectedMochila)) return;
    
    this.studentService.updateMochila(this.selectedMochila.id, this.selectedMochila).subscribe({
      next: (data: Mochila) => {
        this.loadAllData();
        this.cancelEdit();
        this.mostrarErrorSeguro('✅ Mochila actualizada exitosamente');
      },
      error: (error: any) => {
        console.error('Error actualizando mochila:', error);
        this.mostrarErrorSeguro('❌ Error actualizando mochila');
      }
    });
  }

  cancelEdit() {
    this.isEditingStudent = false;
    this.isEditingMochila = false;
    this.selectedStudent = null;
    this.selectedMochila = null;
  }

  deleteStudent(ru: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      this.studentService.deleteStudent(ru).subscribe({
        next: () => {
          console.log('Estudiante eliminado:', ru);
          this.loadAllData();
          this.mostrarErrorSeguro('✅ Estudiante eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('Error eliminando estudiante:', error);
          this.mostrarErrorSeguro('❌ Error eliminando estudiante: ' + error.message);
        }
      });
    }
  }

  deleteMochila(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta mochila?')) {
      this.studentService.deleteMochila(id).subscribe({
        next: () => {
          console.log('Mochila eliminada:', id);
          this.loadAllData();
          this.mostrarErrorSeguro('✅ Mochila eliminada exitosamente');
        },
        error: (error: any) => {
          console.error('Error eliminando mochila:', error);
          this.mostrarErrorSeguro('❌ Error eliminando mochila: ' + error.message);
        }
      });
    }
  }

  validateStudent(student: Student): boolean {
    if (!student.dni || student.dni.length < 3) {
      this.mostrarErrorSeguro('DNI debe tener al menos 3 caracteres');
      return false;
    }
    
    if (!student.name || student.name.length < 2) {
      this.mostrarErrorSeguro('Nombre debe tener al menos 2 caracteres');
      return false;
    }
    
    if (!student.lastName || student.lastName.length < 2) {
      this.mostrarErrorSeguro('Apellido debe tener al menos 2 caracteres');
      return false;
    }
    
    return true;
  }

  validateMochila(mochila: Mochila): boolean {
    if (!mochila.marca || mochila.marca.length < 2) {
      this.mostrarErrorSeguro('Marca debe tener al menos 2 caracteres');
      return false;
    }
    
    if (mochila.capacidad <= 0) {
      this.mostrarErrorSeguro('Capacidad debe ser mayor a 0');
      return false;
    }
    
    return true;
  }

  getColorCode(color: string): string {
    const colorMap: {[key: string]: string} = {
      'azul': '#007bff',
      'rojo': '#dc3545', 
      'verde': '#28a745',
      'amarillo': '#ffc107',
      'negro': '#343a40',
      'blanco': '#f8f9fa',
      'rosa': '#e83e8c',
      'morado': '#6f42c1',
      'naranja': '#fd7e14'
    };
    return colorMap[color.toLowerCase()] || '#6c757d';
  }

  getMochilaName(mochilaId?: number): string {
    if (!mochilaId) return 'Sin mochila';
    const mochila = this.mochilas.find(m => m.id === mochilaId);
    return mochila ? `${mochila.marca} - ${mochila.color}` : 'Mochila no encontrada';
  }

  getStudentWithMochila(mochilaId?: number): string {
    if (!mochilaId) return '';
    
    const student = this.students.find(s => s.mochilaId === mochilaId);
    return student ? `${student.name} ${student.lastName}` : '';
  }

  debugStudentMochila(student: Student) {
    console.log('=== DEBUG ESTUDIANTE ===');
    console.log('Estudiante:', student.name, student.lastName);
    console.log('mochilaId:', student.mochilaId);
    console.log('mochila object:', student.mochila);
    console.log('Mochilas disponibles:', this.mochilas);
    
    if (student.mochilaId) {
      const foundMochila = this.mochilas.find(m => m.id === student.mochilaId);
      console.log('Mochila encontrada:', foundMochila);
    }
  }

  getMochilaById(mochilaId: number): Mochila | undefined {
    return this.mochilas.find(m => m.id === mochilaId);
  }

  testRelaciones() {
    console.log('=== 🧪 TEST DE RELACIONES ===');
    console.log('MOCHILAS:', this.mochilas);
    console.log('ESTUDIANTES:', this.students);
    
    this.students.forEach((student, index) => {
      console.log(`--- Estudiante ${index + 1} ---`);
      console.log('Nombre:', student.name, student.lastName);
      console.log('mochilaId:', student.mochilaId);
      console.log('mochila object:', student.mochila);
      
      if (student.mochilaId) {
        const mochila = this.mochilas.find(m => m.id === student.mochilaId);
        console.log('Mochila encontrada por ID:', mochila);
      }
    });
  }
}