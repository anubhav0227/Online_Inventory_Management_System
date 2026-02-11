package com.demo.inventory.controller;

import com.demo.inventory.model.User;
import com.demo.inventory.security.JwtUtil;
import com.demo.inventory.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthService authService,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder
    ) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ========================= LOGIN =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "username and password are required"));
        }

        User user = authService.findByUsername(username);

        // ❌ User not found → 401
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid credentials"));
        }

        // ❌ Inactive user → 403
        if (!user.isActive()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "account is inactive. Contact admin."));
        }

        // ❌ Wrong password → 401
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid credentials"));
        }

        // ✅ Generate JWT
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()   // ROLE_ADMIN / ROLE_COMPANY
        );

        // ✅ Response expected by frontend
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("username", user.getUsername());

        // frontend expects: "admin" | "company"
        response.put(
                "role",
                user.getRole().replace("ROLE_", "").toLowerCase()
        );

        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    // ========================= REGISTER COMPANY =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {

        String name = body.get("name");
        String username = body.get("username");
        String password = body.get("password");

        if (name == null || username == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "name, username and password are required"));
        }

        try {
            User user = authService.registerCompany(
                    name,
                    username,
                    password
            );

            // Auto-login after register
            String token = jwtUtil.generateToken(
                    user.getUsername(),
                    user.getRole()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("username", user.getUsername());
            response.put(
                    "role",
                    user.getRole().replace("ROLE_", "").toLowerCase()
            );
            response.put("token", token);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
