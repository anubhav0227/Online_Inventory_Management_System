package com.demo.inventory.repository;

import com.demo.inventory.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT COALESCE(SUM(p.totalAmount), 0) FROM Purchase p")
    double getTotalPurchases();
}
