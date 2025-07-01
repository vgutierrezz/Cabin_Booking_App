package com.proyectofinal.api.repository;

import com.proyectofinal.api.model.Cabin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface ICabinRepository extends JpaRepository<Cabin, Long> {
    List<Cabin> findByCategoryName(String name);
    @Query("SELECT c FROM Cabin c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.address.location) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.address.province) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.address.country) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Cabin> findByKeyword(@Param("keyword") String keyword);
}
