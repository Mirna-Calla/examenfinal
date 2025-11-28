package com.example.segundoparcial.services;

import com.example.segundoparcial.models.student;
import com.example.segundoparcial.models.mochila;
import com.example.segundoparcial.Repository.studentRepository;
import com.example.segundoparcial.Repository.mochilaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class studentservices {

    private final studentRepository studentRepository;
    private final mochilaRepository mochilaRepository;

    public studentservices(studentRepository studentRepository, mochilaRepository mochilaRepository) {
        this.studentRepository = studentRepository;
        this.mochilaRepository = mochilaRepository;
    }

    public List<student> getAllStudents() {
        return studentRepository.findAll();
    }

    public student getStudent(int ru) {
        return studentRepository.findById(ru).orElse(null);
    }

    public student saveStudent(student student) {
        // ✅ MANEJAR RELACIÓN MOCHila CORRECTAMENTE
        if (student.getMochila() != null && student.getMochila().getId() > 0) {
            Optional<mochila> mochilaExistente = mochilaRepository.findById(student.getMochila().getId());
            if (mochilaExistente.isPresent()) {
                // Usar la mochila existente de la base de datos
                student.setMochila(mochilaExistente.get());
            } else {
                // La mochila no existe, no asignar
                student.setMochila(null);
            }
        }
        return studentRepository.save(student);
    }

    public boolean deleteStudent(int ru) {
        if (studentRepository.existsById(ru)) {
            studentRepository.deleteById(ru);
            return true;
        }
        return false;
    }

    public student updateStudent(int ru, student studentDetails) {
        Optional<student> existingStudent = studentRepository.findById(ru);
        if (existingStudent.isPresent()) {
            student student = existingStudent.get();

            // Actualizar campos básicos
            student.setDni(studentDetails.getDni());
            student.setName(studentDetails.getName());
            student.setLastName(studentDetails.getLastName());
            student.setAddress(studentDetails.getAddress());

            // ✅ MANEJAR RELACIÓN MOCHila CORRECTAMENTE
            if (studentDetails.getMochila() != null && studentDetails.getMochila().getId() > 0) {
                Optional<mochila> mochilaExistente = mochilaRepository.findById(studentDetails.getMochila().getId());
                if (mochilaExistente.isPresent()) {
                    // Usar la mochila existente de la base de datos
                    student.setMochila(mochilaExistente.get());
                } else {
                    // La mochila no existe, quitar relación
                    student.setMochila(null);
                }
            } else {
                // No hay mochila en la actualización, quitar relación
                student.setMochila(null);
            }

            return studentRepository.save(student);
        }
        return null;
    }

    public boolean existsByDni(String dni) {
        return studentRepository.existsByDni(dni);
    }
}