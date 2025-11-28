package com.example.segundoparcial.controllers;

import com.example.segundoparcial.models.mochila;
import com.example.segundoparcial.services.mochilaservices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/mochilas")
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class MochilaController {

    private final mochilaservices mochilaService;

    public MochilaController(mochilaservices mochilaService) {
        this.mochilaService = mochilaService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    List<mochila> getMochilas(@RequestParam(required = false, defaultValue = "*") String marca) {
        System.out.println("✅ GET /api/mochilas - Solicitando mochilas");
        List<mochila> todasMochilas = this.mochilaService.getAllMochilas();
        if(marca.equals("*"))
            return todasMochilas;
        return todasMochilas.stream()
                .filter(m -> m.getMarca().equals(marca))
                .toList();
    }

    @GetMapping("/{id}")
    ResponseEntity<mochila> getMochila(@PathVariable int id) {
        mochila mochila = this.mochilaService.getMochila(id);
        if(mochila == null)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(mochila);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    mochila postMochila(@RequestBody mochila mochila){
        return this.mochilaService.saveMochila(mochila);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteMochila(@PathVariable int id){
        boolean result = this.mochilaService.deleteMochila(id);
        if(!result)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    ResponseEntity<mochila> putMochila(@PathVariable int id, @RequestBody mochila mochila){
        mochila updatedMochila = this.mochilaService.updateMochila(id, mochila);
        if(updatedMochila == null)
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok(updatedMochila);
    }

    @PatchMapping("/{id}")
    ResponseEntity<mochila> patchMochila(@PathVariable int id, @RequestBody Map<String, Object> update){
        mochila mochila = this.mochilaService.getMochila(id);
        if(mochila == null)
            return ResponseEntity.badRequest().body(null);

        update.forEach((key,value) -> {
            switch (key) {
                case "marca":
                    mochila.setMarca((String) value);
                    break;
                case "color":
                    mochila.setColor((String) value);
                    break;
                case "capacidad":
                    mochila.setCapacidad((Integer) value);
                    break;
                case "material":
                    mochila.setMaterial((String) value);
                    break;
            }
        });
        return ResponseEntity.ok(this.mochilaService.saveMochila(mochila));
    }
}