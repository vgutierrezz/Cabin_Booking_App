package com.proyectofinal.api.config;

import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.repository.ICategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ICategoryRepository categoryRepository;

    public DataInitializer(ICategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Rústica", "Cabañas rústicas de montaña"));
            categoryRepository.save(new Category("Moderna", "Cabañas modernas y equipadas"));
            categoryRepository.save(new Category("Ecológica", "Cabañas ecológicas sustentables"));
        }

    }
}
