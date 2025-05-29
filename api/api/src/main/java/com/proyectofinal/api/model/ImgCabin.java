package com.proyectofinal.api.model;

import jakarta.persistence.*;

public class ImgCabin {
    //@Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Lob
    //@Column(columnDefinition = "BYTEA")
    private byte[] data;

    //@ManyToOne
    //@JoinColumn(name = "cabin_id")
    private Cabin cabin;

    public ImgCabin() {
    }

    public ImgCabin(byte[] data, Cabin cabin) {
        this.data = data;
        this.cabin = cabin;
    }

    public ImgCabin(Long id, byte[] data, Cabin cabin) {
        this.id = id;
        this.data = data;
        this.cabin = cabin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Cabin getCabin() {
        return cabin;
    }

    public void setCabin(Cabin cabin) {
        this.cabin = cabin;
    }
}
