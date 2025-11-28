package com.example.segundoparcial.models;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ru;

    @Column(name = "dni", nullable = false)
    private String dni;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "address")
    private String address;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mochila_id")
    private mochila mochilaObj;

    // Constructores
    public student() {}

    public student(String dni, String name, String lastName, String address, mochila mochilaObj) {
        this.dni = dni;
        this.name = name;
        this.lastName = lastName;
        this.address = address;
        this.mochilaObj = mochilaObj;
    }

    // Getters y Setters (con nombres en minúscula)
    public int getRu() { return ru; }
    public void setRu(int ru) { this.ru = ru; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public mochila getMochila() { return mochilaObj; }
    public void setMochila(mochila mochilaObj) { this.mochilaObj = mochilaObj; }
}