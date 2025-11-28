package com.example.segundoparcial.models;

import jakarta.persistence.*;

@Entity
@Table(name = "mochilas")
public class mochila {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "marca", nullable = false)
    private String marca;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "capacidad")
    private int capacidad;

    @Column(name = "material", nullable = false)
    private String material;

    // Constructores
    public mochila() {}

    public mochila(String marca, String color, int capacidad, String material) {
        this.marca = marca;
        this.color = color;
        this.capacidad = capacidad;
        this.material = material;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getCapacidad() { return capacidad; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
}