package com.example.segundoparcial.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RootController {

    @GetMapping
    public String apiRoot() {
        return "Backend funcionando correctamente ✔️";
    }
}

