package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.service.ICabinService;
import com.proyectofinal.api.service.impl.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "Obtener una cabaña por su id")
    @PostMapping("/create")
    public ResponseEntity<CabinDTO> save(@RequestBody CabinDTO cabinDTO){
        ResponseEntity<CabinDTO> response;
        //Verifico si existe la categoría
        Long categoryId = cabinDTO.getCategoryId();
        if(categoryService.findById(categoryId).isPresent()){
            //Si existe la categoría, se crea la cabaña y seteamos un codigo 200
            response = ResponseEntity.ok(cabinService.save(cabinDTO));
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
    @PutMapping("/update")
    public ResponseEntity<CabinDTO> update(@RequestBody CabinDTO cabinDTO) throws Exception{
        ResponseEntity<CabinDTO> response;
        //Verifico si existe la CABAÑA
        if(cabinService.findById(cabinDTO.getId()).isPresent()){
            //Seteamos al Response Entity con el código 200 y le agregamos la cabaña DTO como cuerpo de la respuesta
            response = ResponseEntity.ok(cabinService.update(cabinDTO));
        }else{
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @Operation(summary = "Obtener una cabaña por su id")
    @GetMapping("/{id}")
    public ResponseEntity<CabinDTO> findById(@PathVariable Long id){
        return ResponseEntity.ok(cabinService.findById(id).get());
    }

}
