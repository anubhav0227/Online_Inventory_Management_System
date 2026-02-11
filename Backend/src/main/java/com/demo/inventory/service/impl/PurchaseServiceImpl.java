package com.demo.inventory.service.impl;

import com.demo.inventory.dto.PurchaseResponse;
import com.demo.inventory.model.Product;
import com.demo.inventory.model.Purchase;
import com.demo.inventory.repository.ProductRepository;
import com.demo.inventory.repository.PurchaseRepository;
import com.demo.inventory.service.PurchaseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseServiceImpl(
            PurchaseRepository purchaseRepository,
            ProductRepository productRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Purchase addPurchase(
            Long productId,
            int quantity,
            double unitPrice,
            String supplier
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // update stock
        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);

        Purchase purchase = new Purchase();
        purchase.setProduct(product);
        purchase.setQuantity(quantity);
        purchase.setUnitPrice(unitPrice);
        purchase.setTotalAmount(quantity * unitPrice);
        purchase.setSupplierName(
                supplier != null ? supplier : "Unknown"
        );

        return purchaseRepository.save(purchase);
    }

    @Override
    public List<PurchaseResponse> getAll() {
        return purchaseRepository.findAll().stream().map(p -> {
            PurchaseResponse dto = new PurchaseResponse();
            dto.setId(p.getId());
            dto.setProductId(p.getProduct().getId());
            dto.setProductName(p.getProduct().getName());
            dto.setQuantity(p.getQuantity());
            dto.setUnitPrice(p.getUnitPrice());
            dto.setTotalAmount(p.getTotalAmount());
            dto.setSupplierName(p.getSupplierName());
            dto.setDate(p.getDate());
            return dto;
        }).toList();
    }
}
