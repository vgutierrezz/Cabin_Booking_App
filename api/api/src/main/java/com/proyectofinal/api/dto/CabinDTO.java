package com.proyectofinal.api.dto;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Image;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


//CLASE PLANA PARA TRANSFERIRIR INFORMACIÓN - NO SE MAPEA A LA BASE
public class CabinDTO {
    private Long id;
    private String name;
    private String description;
    private int capacity;
    private int price;
    // Entrada desde el cliente
    private List<MultipartFile> imageFiles;
    // Salida hacia el cliente
    private List<ImageDTO> images;
    private AddressDTO address;
    private String categoryName;
    private Set<String> featuresName;

    public CabinDTO() {
    }

    public CabinDTO(Cabin cabin) {
        this.id = cabin.getId();
        this.name = cabin.getName();
        this.description = cabin.getDescription();
        this.capacity = cabin.getCapacity();
        this.price = cabin.getPrice();
        this.categoryName = cabin.getCategory() != null ? cabin.getCategory().getName() : null;
        this.address = new AddressDTO(cabin.getAddress());
        this.featuresName = cabin.getFeatures().stream()
                .map(f -> f.getName())
                .collect(Collectors.toSet());
        this.images = cabin.getImages().stream()
                .map(ImageDTO::new)
                .collect(Collectors.toList());

    }

    public CabinDTO(String name, String description, int capacity, int price,  List<MultipartFile> images, AddressDTO address, String categoryName, Set<String> features) {
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.price = price;
        this.imageFiles = images;
        this.address = address;
        this.categoryName = categoryName;

        // Mapeo features de la entidad a DTO
        this.featuresName = features;
    }

    public CabinDTO(Long id, String name, String description, int capacity, int price,
                    List<ImageDTO> images, AddressDTO address, String categoryName, Set<String> featuresName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.price = price;
        this.images = images; // imágenes ya existentes
        this.address = address;
        this.categoryName = categoryName;
        this.featuresName = featuresName;
    }


    public CabinDTO(Long id, String name, String description, int capacity, int price,  List<MultipartFile> images, AddressDTO address, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.price = price;
        this.imageFiles = images;
        this.address = address;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public List<MultipartFile> getImageFiles() {
        return imageFiles;
    }

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

    // Para recibir archivos desde el frontend
    public void setImageFiles(List<MultipartFile> imageFiles) {
        this.imageFiles = imageFiles;
    }

    // Para devolver imágenes al frontend
    public void setImages(List<ImageDTO> images) {
        this.images = images;
    }

    public AddressDTO getAddress() {

        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Set<String> getFeatures() {
        return featuresName;
    }

    public void setFeatures(Set<String> features) {
        this.featuresName = features;
    }
}
