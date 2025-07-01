package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.dto.BookingDTO;
import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.dto.OccupiedDateRangeDTO;
import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.mapper.BookingMapper;
import com.proyectofinal.api.mapper.CabinMapper;
import com.proyectofinal.api.mapper.UserMapper;
import com.proyectofinal.api.model.Booking;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Favorite;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.IBookingRepository;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.IUserRepository;
import com.proyectofinal.api.service.IBookingService;
import com.proyectofinal.api.service.ICabinService;
import com.proyectofinal.api.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {
    private final IBookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final IUserRepository userRepository;
    private final ICabinRepository cabinRepository;
    private final CabinMapper cabinMapper;
    private final UserMapper userMapper;

    private final EmailService emailService;

    @Override
    @Transactional
    public boolean save(BookingDTO bookingDTO) {
        Optional<User> userOpt = userRepository.findById(bookingDTO.getUserId());
        Optional<Cabin> cabinOpt = cabinRepository.findById(bookingDTO.getCabinId());

        if (userOpt.isEmpty() || cabinOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        Cabin cabin = cabinOpt.get();

        boolean exists = bookingRepository.existsByUserIdAndCabinIdAndStartDateAndEndDate(
                user.getId(), cabin.getId(), bookingDTO.getStartDate(), bookingDTO.getEndDate());
        if (exists) {
            return false;
        }

        Booking booking = Booking.builder()
                .cabin(cabin)
                .user(user)
                .startDate(bookingDTO.getStartDate())
                .endDate(bookingDTO.getEndDate())
                .build();
        Booking saved = bookingRepository.save(booking);

        // Crear mensaje personalizado
        String mensaje = String.format(
                "Hola %s,\n\nTu reserva en la cabaña '%s' ha sido confirmada.\n\nDesde: %s\nHasta: %s\n\n¡Gracias por elegirnos!",
                user.getFirstName(), cabin.getName(), bookingDTO.getStartDate(), bookingDTO.getEndDate()
        );

        // Enviar email
        emailService.sendBookingConfirmation(user.getEmail(), "Reserva confirmada", mensaje);

        return true;
    }


    @Override
    public Optional<BookingDTO> findById(Long id) {
        return bookingRepository.findById(id).map(bookingMapper::toDTO);
    }

    @Override
    public void deleteById(Long id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public List<BookingDTO> findAll() {
        return bookingRepository.findAll().stream().map(bookingMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> findByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(bookingMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> findByCabinId(Long cabinId) {
        return bookingRepository.findByCabinId(cabinId).stream().map(bookingMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<OccupiedDateRangeDTO> getOccupiedDatesByCabinId(Long cabinId) {
        return bookingRepository.findByCabinId(cabinId).stream()
                .map(b -> new OccupiedDateRangeDTO(b.getStartDate(), b.getEndDate()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsBooking(Long userId, Long cabinId, LocalDate startDate, LocalDate endDate) {
        return bookingRepository.existsByUserIdAndCabinIdAndStartDateAndEndDate(userId, cabinId, startDate, endDate);
    }

    @Override
    @Transactional
    public void qualifyBooking(Long bookingId, Integer rating) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        booking.setRating(rating);
        bookingRepository.save(booking);
    }
}
