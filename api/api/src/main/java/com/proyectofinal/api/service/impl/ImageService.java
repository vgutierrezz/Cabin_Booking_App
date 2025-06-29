package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Image;
import com.proyectofinal.api.repository.IImageRepository;
import com.proyectofinal.api.service.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService implements IImageService {
    private final IImageRepository imageRepository;

    @Autowired
    public ImageService(IImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Image saveImage(MultipartFile file, Cabin cabin) throws IOException {
        Image image = new Image();
        image.setFileName(file.getOriginalFilename());
        image.setData(file.getBytes());
        image.setCabin(cabin);
        return imageRepository.save(image);
    }
}
