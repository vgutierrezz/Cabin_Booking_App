package com.proyectofinal.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Cabins")
public class Cabin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    //@Column(mappedBy = "cabin", cascade = CascadeType.ALL, orphanRemoval = true)
    private String image;

    private int capacity;
    private int price;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Address address;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Cabin() {
    }

    public Cabin(String name, String description, String image, int capacity, int price, Address address, Category category) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.capacity = capacity;
        this.price = price;
        this.address = address;
        this.category = category;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
