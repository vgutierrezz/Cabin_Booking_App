package com.proyectofinal.api.entity;

import com.proyectofinal.api.model.Booking;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.IBookingRepository;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.IUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class BookingEntityTest {

    @Autowired
    private IBookingRepository bookingRepository;

    @Autowired
    private ICabinRepository cabinRepository;

    @Autowired
    private IUserRepository userRepository;

    @Test
    void shouldSaveBooking() {
        // Crear datos previos
        User user = User.builder().email("test@user.com").password("123").firstName("Test").build();
        userRepository.save(user);

        Cabin cabin = Cabin.builder().name("Cabaña 1").price(1000).capacity(4).build();
        cabinRepository.save(cabin);

        // Crear reserva
        Booking booking = Booking.builder()
                .user(user)
                .cabin(cabin)
                .startDate(LocalDate.of(2025, 7, 1))
                .endDate(LocalDate.of(2025, 7, 5))
                .build();

        Booking saved = bookingRepository.save(booking);

        // Assertions
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getEmail()).isEqualTo("test@user.com");
        assertThat(saved.getCabin().getName()).isEqualTo("Cabaña 1");
        assertThat(saved.getStartDate()).isEqualTo(LocalDate.of(2025, 7, 1));
    }
}

