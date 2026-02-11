package com.demo.inventory.service.impl;

import com.demo.inventory.model.Company;
import com.demo.inventory.model.User;
import com.demo.inventory.repository.CompanyRepository;
import com.demo.inventory.repository.UserRepository;
import com.demo.inventory.service.CompanyService;
import org.springframework.stereotype.Service;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyServiceImpl(
            CompanyRepository companyRepository,
            UserRepository userRepository
    ) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Company getCompanyByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    @Override
    public Company saveOrUpdateCompany(Company body, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findByUser(user)
                .orElse(new Company());

        company.setName(body.getName());
        company.setAddress(body.getAddress());
        company.setPhone(body.getPhone());
        company.setEmail(body.getEmail());
        company.setUser(user);

        return companyRepository.save(company);
    }
}
