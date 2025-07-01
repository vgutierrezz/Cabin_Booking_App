package com.proyectofinal.api.entity;

import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.repository.ICategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class CategoryEntityTest {

    @Autowired
    private ICategoryRepository categoryRepository;

    @Test
    void shouldSaveCategory() {
        Category category = Category.builder()
                .name("Montaña")
                .description("Cabañas en zonas montañosas")
                .build();

        Category saved = categoryRepository.save(category);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Montaña");
    }
}
