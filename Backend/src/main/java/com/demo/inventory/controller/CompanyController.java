package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.model.Company;
import com.demo.inventory.service.CompanyService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // ================= GET COMPANY =================
    @GetMapping
    public ApiResponse<?> getCompany(Authentication auth) {
        String username = auth.getName();
        Company company = companyService.getCompanyByUsername(username);
        return ApiResponse.success("Company Fetched", company);
    }

    // ================= CREATE / UPDATE COMPANY =================
    @PostMapping
    public ApiResponse<?> saveCompany(
            @RequestBody Company body,
            Authentication auth
    ) {
        String username = auth.getName();
        Company saved = companyService.saveOrUpdateCompany(body, username);
        return ApiResponse.success("Company Details Saved", saved);
    }
}
