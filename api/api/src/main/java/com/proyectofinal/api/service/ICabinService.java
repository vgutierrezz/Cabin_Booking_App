package com.proyectofinal.api.service;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.model.Cabin;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface ICabinService {
    CabinDTO save(CabinDTO cabinDTO,  List<MultipartFile> files) throws RuntimeException;
    Optional<CabinDTO> findById(Long id);
    CabinDTO update(CabinDTO cabinDTO, List<MultipartFile> images) throws Exception;
    void deleteById(Long id);
    List<CabinDTO> findAll();
    List<CabinDTO> findByCategoryName(String categoryName);
}
