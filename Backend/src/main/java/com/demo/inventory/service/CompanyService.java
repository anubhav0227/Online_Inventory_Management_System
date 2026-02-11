package com.demo.inventory.service;

import com.demo.inventory.model.Company;

public interface CompanyService {

    Company getCompanyByUsername(String username);

    Company saveOrUpdateCompany(Company body, String username);
}
