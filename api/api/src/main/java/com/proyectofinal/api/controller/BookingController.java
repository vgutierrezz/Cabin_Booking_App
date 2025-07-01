package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.BookingDTO;
import com.proyectofinal.api.dto.OccupiedDateRangeDTO;
import com.proyectofinal.api.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final IBookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Boolean> save(@RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.save(bookingDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> findById(@PathVariable Long id) {
        Optional<BookingDTO> booking = bookingService.findById(id);
        return booking.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        bookingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> findByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.findByUserId(userId));
    }

    @GetMapping("/cabin/{cabinId}")
    public ResponseEntity<List<BookingDTO>> FindByCabinId(@PathVariable Long cabinId) {
        return ResponseEntity.ok(bookingService.findByCabinId(cabinId));
    }

    @GetMapping("/cabin/{cabinId}/occupied-dates")
    public ResponseEntity<List<OccupiedDateRangeDTO>> getOccupiedDates(@PathVariable Long cabinId) {
        return ResponseEntity.ok(bookingService.getOccupiedDatesByCabinId(cabinId));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> existsBooking(
            @RequestParam Long userId,
            @RequestParam Long cabinId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        boolean exists = bookingService.existsBooking(userId, cabinId, startDate, endDate);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/{bookingId}/qualify/{rating}")
    public ResponseEntity<Void> qualifyBooking(@PathVariable Long bookingId, @PathVariable Integer rating) {
        bookingService.qualifyBooking(bookingId, rating);
        return ResponseEntity.ok().build();
    }
}
