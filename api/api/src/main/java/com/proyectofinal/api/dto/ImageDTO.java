package com.proyectofinal.api.dto;

import com.proyectofinal.api.model.Image;

import java.util.Base64;

public class ImageDTO {
    private Long id;
    private String fileName;
    private String data;

    public ImageDTO() {}

    public ImageDTO(Image image) {
        this.id = image.getId();
        this.fileName = image.getFileName();
        this.data = Base64.getEncoder().encodeToString(image.getData());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}