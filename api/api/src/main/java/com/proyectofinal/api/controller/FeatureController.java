package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.FeatureDTO;
import com.proyectofinal.api.model.Feature;
import com.proyectofinal.api.service.impl.FeatureService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/features")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping("/{id}")
    public FeatureDTO findById(@PathVariable Long id) {
        return featureService.findById(id).orElse(null);
    }

    @GetMapping("/list")
    public List<FeatureDTO> findAll() {
        return featureService.findAll();
    }
}
