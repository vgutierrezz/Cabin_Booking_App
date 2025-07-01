package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface IBookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByCabinId(Long cabinId);
    boolean existsByUserIdAndCabinIdAndStartDateAndEndDate(Long userId, Long cabinId, LocalDate startDate, LocalDate endDate);
}
