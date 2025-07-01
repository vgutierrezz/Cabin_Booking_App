package com.proyectofinal.api.mapper;

import com.proyectofinal.api.dto.BookingDTO;
import com.proyectofinal.api.model.Booking;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;
        return new BookingDTO(
                booking.getId(),
                booking.getCabin() != null ? booking.getCabin().getId() : null,
                booking.getUser() != null ? booking.getUser().getId() : null,
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getRating()
        );
    }

    public Booking toEntity(BookingDTO dto, Cabin cabin, User user) {
        if (dto == null) return null;
        return new Booking(
                dto.getId(),
                cabin,
                user,
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getRating()
        );
    }
}

