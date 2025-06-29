package com.proyectofinal.api.service;

import com.proyectofinal.api.authentication.RegisterRequest;
import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    UserDTO createUser(RegisterRequest request);
    Optional<UserDTO> findById(Long id);
    UserDTO updateRol(UserDTO userDTO) throws RuntimeException;
    void delete(Long id) throws RuntimeException;
    List<UserDTO> findAll();
    Optional<User> findByEmail(String email);
}
