package com.demo.inventory.repository;

import com.demo.inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔐 Auth
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    // 🏢 Admin → Companies
    List<User> findByRole(String role);
}
