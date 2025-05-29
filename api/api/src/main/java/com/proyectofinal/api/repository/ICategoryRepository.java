package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) = LOWER(:name)")
     Optional<Category> findByNameIgnoreCase(@Param("name") String name);
}
