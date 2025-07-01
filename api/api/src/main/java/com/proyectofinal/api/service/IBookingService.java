package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.BookingDTO;
import com.proyectofinal.api.dto.OccupiedDateRangeDTO;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IBookingService {
    boolean save(BookingDTO bookingDTO) throws RuntimeException;
    Optional<BookingDTO> findById(Long id);
    void deleteById(Long id);
    List<BookingDTO> findAll();
    List<BookingDTO> findByUserId(Long userId);
    List<BookingDTO> findByCabinId(Long cabinId);
    List<OccupiedDateRangeDTO> getOccupiedDatesByCabinId(Long cabinId);
    boolean existsBooking(Long userId, Long cabinId, LocalDate startDate, LocalDate endDate);
    void qualifyBooking(Long bookingId, Integer rating);
}
