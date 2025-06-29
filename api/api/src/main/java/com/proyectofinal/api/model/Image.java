package com.proyectofinal.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private byte[] data;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "cabin_id")
    private Cabin cabin;

    public Image() {
    }

    public Image(String fileName, byte[] data, Cabin cabin) {
        this.fileName = fileName;
        this.data = data;
        this.cabin = cabin;
    }

    public Image(Long id, String fileName, byte[] data, Cabin cabin) {
        this.id = id;
        this.fileName = fileName;
        this.data = data;
        this.cabin = cabin;
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
