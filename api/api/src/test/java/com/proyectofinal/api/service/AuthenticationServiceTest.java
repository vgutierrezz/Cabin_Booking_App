package com.proyectofinal.api.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.proyectofinal.api.authentication.AuthenticationRequest;
import com.proyectofinal.api.authentication.AuthenticationResponse;
import com.proyectofinal.api.authentication.AuthenticationService;
import com.proyectofinal.api.authentication.RegisterRequest;
import com.proyectofinal.api.dto.UserDTO;
import com.proyectofinal.api.model.Role;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.configuration.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class AuthenticationServiceTest {

    @Mock
    private IUserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@example.com")
                .password("password")
                .firstName("John")
                .lastName("Doe")
                .build();

        UserDTO userDTO = new UserDTO(1L, "John", "Doe", "test@example.com", "USER");
        User user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .role(Role.USER)
                .build();

        when(userService.createUser(request)).thenReturn(userDTO);
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("fake-jwt-token");

        AuthenticationResponse response = authenticationService.register(request);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        verify(userService).createUser(request);
        verify(jwtService).generateToken(user);
    }

    @Test
    void testLogin_Success() {
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
        User user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .role(Role.USER)
                .build();

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("fake-jwt-token");

        // Simulamos que la autenticación no lanza excepción (éxito)
        doNothing().when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        AuthenticationResponse response = authenticationService.login(request);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("USER", response.getRole());
        assertEquals(user.getEmail(), response.getUser().getEmail());

        verify(authenticationManager).authenticate(any());
        verify(userService).findByEmail("test@example.com");
        verify(jwtService).generateToken(user);
    }

    @Test
    void testLogin_Failure() {
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "wrongpassword");

        // Simulamos que la autenticación falla lanzando excepción
        doThrow(new org.springframework.security.core.AuthenticationException("Bad credentials") {})
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(org.springframework.security.core.AuthenticationException.class, () -> {
            authenticationService.login(request);
        });

        verify(authenticationManager).authenticate(any());
        verify(userService, never()).findByEmail(anyString());
        verify(jwtService, never()).generateToken(any());
    }
}
