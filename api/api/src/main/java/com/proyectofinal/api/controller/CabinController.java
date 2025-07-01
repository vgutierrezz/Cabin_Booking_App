package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.dto.CategoryDTO;
import com.proyectofinal.api.service.ICabinService;
import com.proyectofinal.api.service.impl.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Cabins", description = "Gestión de Cabañas")
@RestController
@RequestMapping("/cabins")
public class CabinController {
    private ICabinService cabinService;
    private CategoryService categoryService;

    @Autowired
    public CabinController(ICabinService cabinService, CategoryService categoryService) {
        this.cabinService = cabinService;
        this.categoryService = categoryService;
    }

    @Operation(summary = "Crear una cabaña con imágenes")
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CabinDTO> save(@RequestPart("cabinDTO") CabinDTO cabinDTO, @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        System.out.println("Recibí cabaña: " + cabinDTO.getName());
        System.out.println("Cantidad imágenes recibidas: " + (images == null ? 0 : images.size()));
        ResponseEntity<CabinDTO> response;
        //Verifico si existe la categoría
        CategoryDTO category = cabinDTO.getCategory();
        if(categoryService.findByName(category.getName()).isPresent()){
            //Si existe la categoría, se crea la cabaña y seteamos un codigo 200
            response = ResponseEntity.ok(cabinService.save(cabinDTO, images));
        }else{
            //Si no existe la categoría, se devuelve un error
            response = ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return response;
    }

    @Operation(summary = "Obtener todas las cabañas")
    @GetMapping("/list")
    public ResponseEntity<List<CabinDTO>> findAll(){
        return ResponseEntity.ok(cabinService.findAll());
    }

    @Operation(summary = "Eliminar una cabaña por su id")
    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id){
        cabinService.deleteById(id);
    }

    @Operation(summary = "Actualizar una cabaña por su id")
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CabinDTO> update(
            @RequestPart("cabinDTO") CabinDTO cabinDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws Exception {
        // Verificar si la cabaña existe
        if (!cabinService.findById(cabinDTO.getId()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Llamar al servicio para actualizar la cabaña con las imágenes (puede ser null)
        CabinDTO updatedCabin = cabinService.update(cabinDTO, images);

        return ResponseEntity.ok(updatedCabin);
    }


    @Operation(summary = "Obtener una cabaña por su id")
    @GetMapping("/{id}")
    public ResponseEntity<CabinDTO> findById(@PathVariable Long id){
        return cabinService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener todas las cabañas de una categoría")
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<CabinDTO>> findByCategoryName(@PathVariable String categoryName){

        return ResponseEntity.ok(cabinService.findByCategoryName(categoryName));
    }

    @Operation(summary = "Obtener todas las cabañas que coinciden con la búsqueda")
    @GetMapping("/search")
    public ResponseEntity<List<CabinDTO>> findByKeyword(@RequestParam String keyword){
        return ResponseEntity.ok(cabinService.findByKeyword(keyword));
    }

}
