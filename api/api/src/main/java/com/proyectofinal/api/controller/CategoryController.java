package com.proyectofinal.api.controller;

import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.service.impl.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<Category> findAll(){
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
    public Category findById(@PathVariable Long id){
        return categoryService.findById(id).orElse(null);
    }


}
