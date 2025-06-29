package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.dto.AddressDTO;
import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.mapper.CabinMapper;
import com.proyectofinal.api.model.*;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.ICategoryRepository;
import com.proyectofinal.api.repository.IFeatureRepository;
import com.proyectofinal.api.service.ICabinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CabinService implements ICabinService {

    private final ImageService imageService;
    private final CabinMapper cabinMapper;
    private ICabinRepository cabinRepository;
    private ICategoryRepository categoryRepository;
    private IFeatureRepository featureRepository;

    @Autowired
    public CabinService(ICabinRepository cabinRepository, ICategoryRepository categoryRepository, ImageService imageService, CabinMapper cabinMapper) {
        this.cabinRepository = cabinRepository;
        this.categoryRepository = categoryRepository;
        this.imageService = imageService;
        this.cabinMapper = cabinMapper;
    }

    @Override
    public CabinDTO save(CabinDTO cabinDTO, List<MultipartFile> files) throws RuntimeException {

        //Mapeo la entidad
        Cabin cabinEntity = cabinMapper.toEntity(cabinDTO);
        cabinRepository.save(cabinEntity); //Persisto mi entidad Cabaña en la DB

        // Guarda las imágenes, asociándolas con la cabaña guardada
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    Image image = imageService.saveImage(file, cabinEntity);
                    cabinEntity.getImages().add(image);
                } catch (IOException e) {
                    throw new RuntimeException("Error al guardar la imagen: " + file.getOriginalFilename(), e);
                }
            }
        }
        // Actualizo la entidad con las imágenes agregadas
        cabinEntity = cabinRepository.save(cabinEntity);

        return cabinMapper.toDTO(cabinEntity);
    }

    @Override
    public Optional<CabinDTO> findById(Long id) {
        return cabinRepository.findById(id)
                .map(cabinMapper::toDTO);
    }

    @Override
    public CabinDTO update(CabinDTO cabinDTO, List<MultipartFile> images) throws Exception {
        Cabin cabin = cabinRepository.findById(cabinDTO.getId())
                .orElseThrow(() -> new Exception("La cabaña que quiere actualizar no existe"));

        // Actualizar cabaña encontrada
        Cabin cabinUpdated = cabinMapper.updateEntityFromDto(cabin, cabinDTO);
        cabinUpdated = cabinRepository.save(cabinUpdated);

        //Crear nuevo DTO
        CabinDTO cabinDTOResponse = cabinMapper.toDTO(cabinUpdated);

        return cabinDTOResponse;
    }


    @Override
    public void deleteById(Long id) throws RuntimeException {
        Optional<CabinDTO> cabinWanted = findById(id);
        if (cabinWanted.isPresent()) {
            cabinRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cabaña no encontrada");
        }
    }

    @Override
    public List<CabinDTO> findAll() {
        return cabinRepository.findAll()
                .stream()
                .map(cabinMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CabinDTO> findByCategoryName(String categoryName) {
        return cabinRepository.findByCategoryName(categoryName)
                .stream()
                .map(cabinMapper::toDTO)
                .collect(Collectors.toList());
    }
}
