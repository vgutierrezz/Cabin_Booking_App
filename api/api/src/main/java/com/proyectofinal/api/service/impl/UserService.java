package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.authentication.RegisterRequest;
import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.model.Role;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.IFeatureRepository;
import com.proyectofinal.api.repository.IImageRepository;
import com.proyectofinal.api.repository.IUserRepository;
import com.proyectofinal.api.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IFeatureRepository featureRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(RegisterRequest request) {
        //CREO EL USUARIO Y LO GUARDO
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        //CREO EL DTO PARA DEVOLVER
        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(savedUser.getFirstName());
        userDTO.setLastName(savedUser.getLastName());
        userDTO.setEmail(savedUser.getEmail());
        userDTO.setRole(savedUser.getRole().name());

        return userDTO;
    }

    @Override
    public List<UserDTO> findAll() {
        List<User> userList = userRepository.findAll();

        List<UserDTO> userDTOList = new ArrayList<>();
        for (User user : userList) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            userDTO.setRole(user.getRole().name());
            userDTOList.add(userDTO);
        }
        return userDTOList;
    }

    @Override
    public Optional<UserDTO> findById(Long id) {
        Optional<User> user = userRepository.findById(id);

        Optional<UserDTO> userDTOOptional = null;
        if (user.isPresent()) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.get().getId());
            userDTO.setFirstName(user.get().getFirstName());
            userDTO.setLastName(user.get().getLastName());
            userDTO.setEmail(user.get().getEmail());
            userDTO.setRole(user.get().getRole().name());

            userDTOOptional = Optional.of(userDTO);
        }
        return userDTOOptional;
    }

    @Override
    public void delete(Long id) throws RuntimeException {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
        }else {
            throw new RuntimeException("No se puede eliminar el usuario");
        }
    }

    @Override
    public UserDTO updateRol(UserDTO userDTO) throws RuntimeException {
        Optional<User> optionalUser = userRepository.findById(userDTO.getId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setRole(Role.valueOf(userDTO.getRole()));

            userRepository.save(user);

            //Creo el dto actualizado para devolver
            UserDTO userDTOReturn = new UserDTO();
            userDTOReturn.setId(user.getId());
            userDTOReturn.setFirstName(user.getFirstName());
            userDTOReturn.setLastName(user.getLastName());
            userDTOReturn.setEmail(user.getEmail());
            userDTOReturn.setRole(user.getRole().name());

            return userDTOReturn;
        }else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
