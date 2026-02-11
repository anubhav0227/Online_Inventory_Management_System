package com.demo.inventory.repository;

import com.demo.inventory.model.Company;
import com.demo.inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUser(User user);
}
