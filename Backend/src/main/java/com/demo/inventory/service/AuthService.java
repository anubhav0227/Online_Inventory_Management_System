package com.demo.inventory.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.inventory.model.User;
import com.demo.inventory.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER COMPANY =================
    @Transactional
    public User registerCompany(String name, String email, String plainPassword) {

        // Frontend sends email as username
        if (userRepo.existsByUsername(email)) {
            throw new IllegalStateException("Email already registered");
        }

        User user = new User();
        user.setName(name);
        user.setUsername(email);          // email = username
        user.setRole("ROLE_COMPANY");     // REQUIRED for Spring Security
        user.setPassword(passwordEncoder.encode(plainPassword));

        return userRepo.save(user);
    }

    // ================= FIND USER =================
    public User findByUsername(String username) {
        return userRepo.findByUsername(username).orElse(null);
    }
}
