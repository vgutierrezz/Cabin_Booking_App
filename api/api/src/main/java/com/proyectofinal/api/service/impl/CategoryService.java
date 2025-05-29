package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.repository.ICategoryRepository;
import com.proyectofinal.api.service.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService implements ICategoryService {

    private ICategoryRepository categoryRepository;

    @Autowired
    public CategoryService(ICategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public void update(Category category) {
        categoryRepository.save(category);
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        Optional<Category> categoryWanted = findById(id);
        if(categoryWanted.isPresent()){
            categoryRepository.deleteById(id);
        }else {
            throw new RuntimeException("Categoria no encontrada");
        }
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> findByName(String name) {

        Optional<Category> category = categoryRepository.findByNameIgnoreCase(name);
        if (category.isPresent()) {
            return category;
        }else {
            throw new RuntimeException("Categoria no encontrada");
        }
    }


}
