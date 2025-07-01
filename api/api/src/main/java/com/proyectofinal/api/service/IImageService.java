package com.proyectofinal.api.service;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IImageService {
    Image saveImage(MultipartFile file, Cabin cabin) throws IOException;
    Image getImageById(Long id);
    void deleteById(Long imageId);
}
