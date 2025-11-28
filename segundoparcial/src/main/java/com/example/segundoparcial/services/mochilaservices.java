package com.example.segundoparcial.services;

import com.example.segundoparcial.models.mochila;
import com.example.segundoparcial.Repository.mochilaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class mochilaservices {

    private final mochilaRepository mochilaRepository;

    public mochilaservices(mochilaRepository mochilaRepository) {
        this.mochilaRepository = mochilaRepository;
    }

    public List<mochila> getAllMochilas() {
        return mochilaRepository.findAll();
    }

    public mochila getMochila(int id) {
        return mochilaRepository.findById(id).orElse(null);
    }

    public mochila saveMochila(mochila mochila) {
        return mochilaRepository.save(mochila);
    }

    public boolean deleteMochila(int id) {
        if (mochilaRepository.existsById(id)) {
            mochilaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public mochila updateMochila(int id, mochila mochilaDetails) {
        Optional<mochila> existingMochila = mochilaRepository.findById(id);
        if (existingMochila.isPresent()) {
            mochila mochila = existingMochila.get();
            mochila.setMarca(mochilaDetails.getMarca());
            mochila.setColor(mochilaDetails.getColor());
            mochila.setCapacidad(mochilaDetails.getCapacidad());
            mochila.setMaterial(mochilaDetails.getMaterial());
            return mochilaRepository.save(mochila);
        }
        return null;
    }
}