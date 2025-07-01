package com.proyectofinal.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long cabinId;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer rating;
}
