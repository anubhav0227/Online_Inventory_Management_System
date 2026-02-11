package com.demo.inventory.controller;

import com.demo.inventory.model.User;
import com.demo.inventory.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= DASHBOARD =================
    @GetMapping("/dashboard")
    public Map<String, Object> getAdminDashboard() {

        List<User> companies = userRepository.findByRole("ROLE_COMPANY");

        long totalCompanies = companies.size();
        long activeCompanies = companies.stream()
                .filter(User::isActive)
                .count();

        Map<String, Object> response = new HashMap<>();
        response.put("totalCompanies", totalCompanies);
        response.put("activeCompanies", activeCompanies);

        return response;
    }

    // ================= COMPANIES =================
    @GetMapping("/companies")
    public List<User> getAllCompanies() {
        return userRepository.findByRole("ROLE_COMPANY");
    }

    @PatchMapping("/companies/{id}/status")
    public User updateCompanyStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {

        Boolean active = body.get("active");
        if (active == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "'active' field is required"
            );
        }

        User company = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Company not found"
                ));

        company.setActive(active);
        return userRepository.save(company);
    }

    // ================= ACTIVITY LOGS =================
    @GetMapping("/activity-logs")
    public List<Map<String, Object>> getActivityLogs() {
        return List.of(
                Map.of(
                        "action", "COMPANY_REGISTERED",
                        "performedBy", "system",
                        "timestamp", "2025-01-01T10:00:00"
                ),
                Map.of(
                        "action", "COMPANY_ACTIVATED",
                        "performedBy", "admin",
                        "timestamp", "2025-01-02T12:30:00"
                )
        );
    }
}








//package com.demo.inventory.controller;
//
//import com.demo.inventory.model.User;
//import com.demo.inventory.repository.UserRepository;
//
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/admin")
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminController {
//
//    private final UserRepository userRepository;
//
//    public AdminController(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    // ================= DASHBOARD =================
//    @GetMapping("/dashboard")
//    public Map<String, Object> getAdminDashboard() {
//
//        List<User> companies = userRepository.findByRole("ROLE_COMPANY");
//
//        long totalCompanies = companies.size();
//        long activeCompanies = companies.stream()
//                .filter(User::isActive)
//                .count();
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("totalCompanies", totalCompanies);
//        response.put("activeCompanies", activeCompanies);
//
//        return response;
//    }
//
//    // ================= COMPANIES =================
//    @GetMapping("/companies")
//    public List<User> getAllCompanies() {
//        return userRepository.findByRole("ROLE_COMPANY");
//    }
//
//    @PatchMapping("/companies/{id}/status")
//    public User updateCompanyStatus(
//            @PathVariable Long id,
//            @RequestBody Map<String, Boolean> body) {
//
//        Boolean active = body.get("active");
//        if (active == null) {
//            throw new RuntimeException("active field is required");
//        }
//
//        User company = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Company not found"));
//
//        company.setActive(active);
//        return userRepository.save(company);
//    }
//
//    // ================= ACTIVITY LOGS =================
//    @GetMapping("/activity-logs")
//    public List<Map<String, Object>> getActivityLogs() {
//        return List.of(
//            Map.of(
//                "action", "COMPANY_REGISTERED",
//                "performedBy", "system",
//                "timestamp", "2025-01-01T10:00:00"
//            ),
//            Map.of(
//                "action", "COMPANY_ACTIVATED",
//                "performedBy", "admin",
//                "timestamp", "2025-01-02T12:30:00"
//            )
//        );
//    }
//}
