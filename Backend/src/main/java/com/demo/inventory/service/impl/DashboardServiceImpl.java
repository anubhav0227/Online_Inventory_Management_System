package com.demo.inventory.service.impl;

import com.demo.inventory.repository.ProductRepository;
import com.demo.inventory.repository.PurchaseRepository;
import com.demo.inventory.repository.SaleRepository;
import com.demo.inventory.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;

    public DashboardServiceImpl(
            ProductRepository productRepository,
            SaleRepository saleRepository,
            PurchaseRepository purchaseRepository
    ) {
        this.productRepository = productRepository;
        this.saleRepository = saleRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Override
    public Map<String, Object> getSummary() {

        long totalProducts = productRepository.count();
        double totalSales = saleRepository.getTotalSales();
        double totalPurchases = purchaseRepository.getTotalPurchases();

        double totalExpenses = 0;
        double netProfit = totalSales - (totalPurchases + totalExpenses);

        Map<String, Object> data = new HashMap<>();
        data.put("totalProducts", totalProducts);
        data.put("totalSales", totalSales);
        data.put("totalPurchases", totalPurchases);
        data.put("totalExpenses", totalExpenses);
        data.put("netProfit", netProfit);

        return data;
    }
}
