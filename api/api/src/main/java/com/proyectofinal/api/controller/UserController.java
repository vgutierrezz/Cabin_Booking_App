package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Users", description = "Gestión de Usuarios")
@RestController
@RequestMapping("/users")
public class UserController {

    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Actualizar un usuario por su id")
    @PutMapping("/update")
    public ResponseEntity<UserDTO> update(@RequestBody UserDTO userDTO) throws Exception {
        ResponseEntity<UserDTO> response;

        //Verifico si existe el usuario
        Optional<UserDTO> userWanted = userService.findById(userDTO.getId());
        if (userWanted.isPresent()) {
            response = ResponseEntity.ok(userService.updateRol(userDTO));
        }else {
            response = ResponseEntity.badRequest().build();
        }
        return response;
    }

    @Operation(summary = "Eliminar una cabaña por su id")
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @Operation(summary = "Obtener todos los usuarios")
    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @Operation(summary = "Obtener un usuario por id")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id).get());
    }
}
