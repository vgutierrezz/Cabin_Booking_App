package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.FeatureDTO;
import java.util.List;

public interface IFeatureService {
    List<FeatureDTO> findAll();
}
