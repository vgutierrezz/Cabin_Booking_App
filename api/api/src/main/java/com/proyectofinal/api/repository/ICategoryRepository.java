package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}
