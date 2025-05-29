package com.proyectofinal.api.service;

import com.proyectofinal.api.model.ImgCabin;

import java.util.List;
import java.util.Optional;

public interface IImgCabinService {
    List<ImgCabin> findByCabinId(Long id);
    Optional<ImgCabin> findById(Long id);
    ImgCabin save(ImgCabin imgCabin);
    void deleteById(Long id);
    void saveAll(List<ImgCabin> imgCabins);
}
