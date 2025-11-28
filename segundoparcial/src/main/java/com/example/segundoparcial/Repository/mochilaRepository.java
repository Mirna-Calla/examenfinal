package com.example.segundoparcial.Repository;

import com.example.segundoparcial.models.mochila;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface mochilaRepository extends JpaRepository<mochila, Integer> {
}