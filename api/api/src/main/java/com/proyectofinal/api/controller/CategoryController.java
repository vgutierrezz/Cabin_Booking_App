package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.CategoryDTO;
import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.service.impl.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Categories", description = "Gestión de Categorías")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Crear una nueva categoría")
    @PostMapping("/create")
    public Category save(@RequestBody Category category){
        return categoryService.save(category);
    }

    @Operation(summary = "Obtener todas las categorías")
    @GetMapping("/list")
    public List<CategoryDTO> findAll(){
        return categoryService.findAll();
    }

    @Operation(summary = "Eliminar una categoría por su id")
    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id){
        categoryService.deleteById(id);
    }

    @Operation(summary = "Actualizar una categoría por su id")
    @PutMapping("/update/{id}")
    public void update(@PathVariable Long id, @RequestBody Category category){
        categoryService.update(category);
    }

    @Operation(summary = "Obtener una categoría por su id")
    @GetMapping("/{id}")
    public CategoryDTO findById(@PathVariable Long id){
        return categoryService.findById(id).orElse(null);
    }

    @Operation(summary = "Obtener una categoría por su nombre")
    @GetMapping("/name/{name}")
    public ResponseEntity<CategoryDTO> findByName(String name){
        return ResponseEntity.ok(categoryService.findByName(name).get());
    }
}
