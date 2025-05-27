package com.proyectofinal.api.service;

import com.proyectofinal.api.model.Category;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    Category save(Category category);
    Optional<Category> findById(Long id);
    void update(Category category);
    void deleteById(Long id) throws RuntimeException;
    List<Category> findAll();
}
