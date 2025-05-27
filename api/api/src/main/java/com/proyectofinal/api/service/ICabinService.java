package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.model.Cabin;

import java.util.List;
import java.util.Optional;

public interface ICabinService {
    CabinDTO save(CabinDTO cabinDTO);
    Optional<CabinDTO> findById(Long id);
    CabinDTO update(CabinDTO cabinDTO) throws Exception;
    void deleteById(Long id);
    List<CabinDTO> findAll();
}
