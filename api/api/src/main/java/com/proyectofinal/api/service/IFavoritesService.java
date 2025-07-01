package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.CabinDTO;

import java.util.List;
import java.util.Optional;

public interface IFavoritesService {
    boolean save(Long cabinId, Long userId);
    boolean delete(Long cabinId, Long userId);
    Optional<List<CabinDTO>> findAllCabinsForUser(Long userId);
}
