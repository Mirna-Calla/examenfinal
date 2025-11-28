package com.example.segundoparcial.controllers;

import com.example.segundoparcial.models.student;
import com.example.segundoparcial.services.studentservices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200") // ✅ Agregar CORS

@RestController
public class StudentController {

    private final studentservices studentService;

    public StudentController(studentservices studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    List<student> getStudents(@RequestParam(required = false, defaultValue = "*") String nameMochila) {
        System.out.println("✅ GET /api/students - Solicitando estudiantes");
        List<student> todosStudents = this.studentService.getAllStudents();
        if(nameMochila.equals("*"))
            return todosStudents;
        return todosStudents.stream()
                .filter(s -> s.getMochila() != null &&
                        s.getMochila().getMarca().equals(nameMochila))
                .toList();
    }

    @GetMapping("/{ru}")
    ResponseEntity<student> getStudent(@PathVariable int ru) {
        student student = this.studentService.getStudent(ru);
        if(student == null)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(student);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    student postStudent(@RequestBody student student){
        return this.studentService.saveStudent(student);
    }

    @DeleteMapping("/{ru}")
    ResponseEntity<?> deleteStudent(@PathVariable int ru){
        boolean result = this.studentService.deleteStudent(ru);
        if(!result)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{ru}")
    ResponseEntity<student> putStudent(@PathVariable int ru, @RequestBody student student){
        student updatedStudent = this.studentService.updateStudent(ru, student);
        if(updatedStudent == null)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(updatedStudent);
    }

    @PatchMapping("/{ru}")
    ResponseEntity<student> patchStudent(@PathVariable int ru, @RequestBody Map<String, Object> update){
        student student = this.studentService.getStudent(ru);
        if(student == null)
            return ResponseEntity.badRequest().body(null);

        update.forEach((key,value) -> {
            switch (key) {
                case "dni":
                    student.setDni((String) value);
                    break;
                case "name":
                    student.setName((String) value);
                    break;
                case "lastName":
                    student.setLastName((String) value);
                    break;
                case "address":
                    student.setAddress((String) value);
                    break;
            }
        });
        return ResponseEntity.ok(this.studentService.saveStudent(student));
    }
}