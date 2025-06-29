package com.proyectofinal.api.authentication;

import com.proyectofinal.api.configuration.JwtService;
import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.model.Role;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.IUserRepository;
import com.proyectofinal.api.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserService userService;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        //Creo el usuario con los datos que ingresó
        UserDTO userDTO = userService.createUser(request);

        //Obtengo el usuario para generar el token
        Optional<User> user = userService.findByEmail(userDTO.getEmail());
        if (user.isPresent()) {
            var jwt = jwtService.generateToken(user.get());
            return AuthenticationResponse.builder()
                    .token(jwt)
                    .build();

        }else {
            throw new RuntimeException("Error al generar token");
        }
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userService.findByEmail(request.getEmail())
                .orElseThrow();

        var jwt = jwtService.generateToken(user);

        //Creo el DTO del usuario para devolver al front
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name()
        );

        return AuthenticationResponse.builder()
                .token(jwt)
                .user(userDTO)
                .role(user.getRole().name()) //ej: "ADMIN" o "USER"
                .build();
    }
}
