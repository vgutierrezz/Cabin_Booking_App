package com.proyectofinal.api.dto;

import java.util.List;

//CLASE PLANA PARA TRANSFERIRIR INFORMACIÓN - NO SE MAPEA A LA BASE
public class CabinDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    private int capacity;
    private int price;
    private AddressDTO address;
    private String categoryName;

    public CabinDTO() {
    }

    public CabinDTO(String name, String description, String image, int capacity, int price, String street, int number, String location, String province, String country, String categoryName) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.capacity = capacity;
        this.price = price;
        this.address = new AddressDTO(street, number, location, province, country);
        this.categoryName = categoryName;
    }

    public CabinDTO(Long id, String name, String description, String image, int capacity, int price, Long id_address, String street, int number, String location, String province, String country, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.capacity = capacity;
        this.price = price;
        this.address = new AddressDTO(id_address, street, number, location, province, country);
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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
}
