package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IFeatureRepository extends JpaRepository<Feature, Long> {
    Optional<Feature> findByName(String name);
}

