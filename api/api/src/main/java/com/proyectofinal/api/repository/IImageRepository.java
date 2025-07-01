package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IImageRepository extends JpaRepository<Image, Long> {
    Image getImageById(Long id);
}
