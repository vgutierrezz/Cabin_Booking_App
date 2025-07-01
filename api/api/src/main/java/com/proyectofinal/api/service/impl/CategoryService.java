package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.dto.CategoryDTO;
import com.proyectofinal.api.dto.FeatureDTO;
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
    public Optional<CategoryDTO> findById(Long id) {
        return categoryRepository.findById(id)
                .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getDescription()));
    }

    @Override
    public void update(Category category) {
        categoryRepository.save(category);
    }

    @Override
    public void deleteById(Long id) throws RuntimeException {
        Optional<CategoryDTO> categoryWanted = findById(id);
        if (categoryWanted.isPresent()) {
            categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Categoria no encontrada");
        }
    }

    @Override
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName(), c.getDescription()))
                .toList();
    }

    @Override
    public Optional<CategoryDTO> findByName(String name) {
        return categoryRepository.findByNameIgnoreCase(name)
                .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getDescription()));
    }


}
