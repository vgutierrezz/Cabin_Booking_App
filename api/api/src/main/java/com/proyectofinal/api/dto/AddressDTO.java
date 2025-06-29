package com.proyectofinal.api.dto;

import com.proyectofinal.api.model.Address;

public class AddressDTO {
    private Long id;
    private String street;
    private Integer number;
    private String location;
    private String province;
    private String country;

    public AddressDTO() {
    }

    public AddressDTO(Long id, String street, Integer number, String location, String province, String country) {
        this.id = id;
        this.street = street;
        this.number = number;
        this.location = location;
        this.province = province;
        this.country = country;
    }

    public AddressDTO(String street, Integer number, String location, String province, String country) {
        this.street = street;
        this.number = number;
        this.location = location;
        this.province = province;
        this.country = country;
    }

    //Constructor a partir de una entidad
    public AddressDTO(Address address) {
        this.id = address.getId();
        this.street = address.getStreet();
        this.number = address.getNumber();
        this.location = address.getLocation();
        this.province = address.getProvince();
        this.country = address.getCountry();
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

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
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
