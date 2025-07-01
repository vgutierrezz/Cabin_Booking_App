package com.proyectofinal.api.service.impl;

import com.proyectofinal.api.dto.CabinDTO;
import com.proyectofinal.api.mapper.CabinMapper;
import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Favorite;
import com.proyectofinal.api.model.User;
import com.proyectofinal.api.repository.ICabinRepository;
import com.proyectofinal.api.repository.IFavoritesRepository;
import com.proyectofinal.api.repository.IUserRepository;
import com.proyectofinal.api.service.IFavoritesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoritesService implements IFavoritesService {

    @Autowired
    private IFavoritesRepository favoritesRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ICabinRepository cabinRepository;

    @Autowired
    private CabinMapper cabinMapper; // Inyecta el mapper


    @Override
    public boolean save(Long cabinId, Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Cabin> cabinOpt = cabinRepository.findById(cabinId);

        if (userOpt.isEmpty() || cabinOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        Cabin cabin = cabinOpt.get();

        // Verificar si ya existe el favorito para no duplicar
        boolean exists = favoritesRepository.existsByUserAndCabin(user, cabin);
        if (exists) {
            return false; // ya existe
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .cabin(cabin)
                .build();

        favoritesRepository.save(favorite);
        return true;
    }

    @Override
    public boolean delete(Long cabinId, Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Cabin> cabinOpt = cabinRepository.findById(cabinId);

        if (userOpt.isEmpty() || cabinOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        Cabin cabin = cabinOpt.get();

        Optional<Favorite> favoriteOpt = favoritesRepository.findByUserAndCabin(user, cabin);

        if (favoriteOpt.isPresent()) {
            favoritesRepository.delete(favoriteOpt.get());
            return true;
        }
        return false;
    }

    @Override
    public Optional<List<CabinDTO>> findAllCabinsForUser(Long userId) {
        List<Favorite> favorites = favoritesRepository.findByUserId(userId);

        if (favorites.isEmpty()) {
            return Optional.empty();
        }

        List<CabinDTO> favoriteCabins = favorites.stream()
                .map(fav -> {
                    CabinDTO dto = cabinMapper.toDTO(fav.getCabin());
                    dto.setFavorite(true);
                    return dto;
                })
                .collect(Collectors.toList());

        return Optional.of(favoriteCabins);
    }
}
