package com.proyectofinal.api.dto;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Image;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//CLASE PLANA PARA TRANSFERIRIR INFORMACIÓN - NO SE MAPEA A LA BASE
public class CabinDTO {
    private Long id;
    private String name;
    private String description;
    private Integer capacity;
    private Integer rating;
    private Integer price;
    private boolean favorite;
    private List<MultipartFile> imageFiles;  // Entrada desde el cliente
    private List<ImageDTO> images;           // Salida hacia el cliente
    private List<Long> imagesToDelete;
    private AddressDTO address;
    private CategoryDTO category;
    private List<FeatureDTO> features;

    // Convierte las imágenes entrantes a entidades
    public List<Image> getImagesEntities(Cabin cabin) {
        if (imageFiles == null) return List.of();

        return imageFiles.stream()
                .map(file -> {
                    try {
                        return new Image(file.getOriginalFilename(), file.getBytes(), cabin);
                    } catch (Exception e) {
                        throw new RuntimeException("Error al convertir imagen: " + file.getOriginalFilename(), e);
                    }
                })
                .collect(Collectors.toList());
    }

}
