package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.FeatureDTO;
import com.proyectofinal.api.model.Feature;

import java.util.List;
import java.util.Optional;

public interface IFeatureService {
    Optional<FeatureDTO> findById(Long id);
    List<FeatureDTO> findAll();
}
