package com.proyectofinal.api.controller;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.model.Favorite;
import com.proyectofinal.api.repository.IFavoritesRepository;
import com.proyectofinal.api.service.IFavoritesService;
import com.proyectofinal.api.service.impl.FavoritesService;
import com.proyectofinal.api.service.impl.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoritesController {


    private final IFavoritesService favoritesService;
    private final UserService userService;

    public FavoritesController(IFavoritesService favoritesService, UserService userService) {
        this.favoritesService = favoritesService;
        this.userService = userService;
    }

    @PostMapping("create/{cabinId}")
    public ResponseEntity<Boolean> save(@PathVariable Long cabinId, Authentication authentication) {
        Long userId = userService.findByEmail(authentication.getName()).get().getId();
        boolean saved = favoritesService.save(cabinId, userId);
        return saved ? ResponseEntity.ok(true) : ResponseEntity.badRequest().body(false);
    }

    @DeleteMapping("/delete/{cabinId}")
    public ResponseEntity<Boolean> delete(@PathVariable Long cabinId, Authentication authentication) {
        Long userID = userService.findByEmail(authentication.getName()).get().getId();
        boolean deleted = favoritesService.delete(cabinId, userID);
        return deleted ? ResponseEntity.ok(true) : ResponseEntity.badRequest().body(false);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CabinDTO>> findAllCabinsForUser(Authentication authentication) {
        Long userId = userService.findByEmail(authentication.getName()).get().getId();
        return ResponseEntity.ok(favoritesService.findAllCabinsForUser(userId).orElse(List.of()));
    }
}
