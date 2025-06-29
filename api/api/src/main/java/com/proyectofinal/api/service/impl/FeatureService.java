package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.dto.FeatureDTO;
import com.proyectofinal.api.model.Feature;
import com.proyectofinal.api.repository.IFeatureRepository;
import com.proyectofinal.api.service.IFeatureService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService implements IFeatureService {

    private final IFeatureRepository featureRepository;

    public FeatureService(IFeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    @Override
    public List<FeatureDTO> findAll() {
        return featureRepository.findAll()
                .stream()
                .map(f -> new FeatureDTO(f.getId(), f.getName()))
                .toList();
    }
}
