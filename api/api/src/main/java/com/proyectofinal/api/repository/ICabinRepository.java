package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Cabin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICabinRepository extends JpaRepository<Cabin, Long> {
}
