package com.proyectofinal.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Addreses")
public class Address {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String street;
    private int number;
    private String location;
    private String province;
    private String country;

    public Address() {
    }

    public Address(String street, int number, String location, String province, String country) {
        this.street = street;
        this.number = number;
        this.location = location;
        this.province = province;
        this.country = country;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
