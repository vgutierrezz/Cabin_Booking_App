package com.proyectofinal.api.entity;

import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.IUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserEntityTest {

    @Autowired
    private IUserRepository userRepository;

    @Test
    void shouldSaveUser() {
        User user = User.builder()
                .firstName("Valen")
                .email("valen@example.com")
                .password("123456")
                .build();

        User saved = userRepository.save(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("valen@example.com");
    }
}
