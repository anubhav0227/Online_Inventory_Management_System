package com.demo.inventory.security;

import com.demo.inventory.model.Company;
import com.demo.inventory.model.User;
import com.demo.inventory.repository.CompanyRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private final CompanyRepository companyRepository;

    public AuthUtil(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company getCurrentCompany() {
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return companyRepository
                .findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
}
