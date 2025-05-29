package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Cabin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface ICabinRepository extends JpaRepository<Cabin, Long> {
    List<Cabin> findByCategoryName(String name);
}
