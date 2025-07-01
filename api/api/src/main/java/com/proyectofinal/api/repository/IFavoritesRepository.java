package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Cabin;
import com.proyectofinal.api.model.Favorite;
import com.proyectofinal.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IFavoritesRepository extends JpaRepository<Favorite, Long> {
    boolean  existsByUserAndCabin(User user, Cabin cabin);
    Optional<Favorite> findByUserAndCabin(User user, Cabin cabin);
    List<Favorite> findByUserId(Long userId);
}
