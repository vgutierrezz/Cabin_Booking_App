package com.proyectofinal.api.dto;

//CLASE PLANA PARA TRANSFERIRIR INFORMACIÓN - NO SE MAPEA A LA BASE
public class CabinDTO {
    private Long id;
    private String name;
    private String description;
    private String image;
    private int capacity;
    private int rating;
    private int price;
    private AddressDTO address;
    private Long categoryId;

    public CabinDTO() {
    }

    public CabinDTO(Long id, String name, String description, String image, int capacity, int rating, int price, String street, int number, String location, String province, String country, Long categoryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.capacity = capacity;
        this.rating = rating;
        this.price = price;
        this.address = new AddressDTO(street, number, location, province, country);
        this.categoryId = categoryId;
    }

    public CabinDTO(Long id, String name, String description, String image, int capacity, int rating, int price, Long id_address, String street, int number, String location, String province, String country, Long categoryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.capacity = capacity;
        this.rating = rating;
        this.price = price;
        this.address = new AddressDTO(id_address, street, number, location, province, country);
        this.categoryId = categoryId;
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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
