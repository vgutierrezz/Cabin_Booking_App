package com.proyectofinal.api.entity;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Category;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.ICategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class CabinEntityTest {

    @Autowired
    private ICabinRepository cabinRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Test
    void shouldSaveCabinWithCategory() {
        Category category = Category.builder().name("Playa").description("Cabañas frente al mar").build();
        categoryRepository.save(category);

        Cabin cabin = Cabin.builder()
                .name("Cabaña Sol")
                .price(2000)
                .capacity(5)
                .category(category)
                .build();

        Cabin saved = cabinRepository.save(cabin);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCategory().getName()).isEqualTo("Playa");
    }
}
