package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.model.User;
import com.demo.inventory.service.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET /profile
    @GetMapping
    public ApiResponse<?> getProfile(Authentication auth) {
        String username = auth.getName();
        User user = profileService.getProfile(username);

        return ApiResponse.success(
                "Profile Fetched",
                Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "role", user.getRole().replace("ROLE_", "")
                )
        );
    }

    // PUT /profile
    @PutMapping
    public ApiResponse<?> updateProfile(
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        String username = auth.getName();

        String newUsername = body.get("username");
        String newPassword = body.get("password");

        User updated = profileService.updateProfile(
                username,
                newUsername,
                newPassword
        );

        return ApiResponse.success(
                "Profile Updated",
                Map.of(
                        "id", updated.getId(),
                        "username", updated.getUsername(),
                        "role", updated.getRole().replace("ROLE_", "")
                )
        );
    }
}
