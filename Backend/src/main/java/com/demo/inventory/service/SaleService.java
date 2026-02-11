package com.demo.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.demo.inventory.model.Product;
import com.demo.inventory.model.Sale;
import com.demo.inventory.repository.ProductRepository;
import com.demo.inventory.repository.SaleRepository;

@Service
public class SaleService {

    private final SaleRepository saleRepo;
    private final ProductRepository productRepo;

    public SaleService(SaleRepository saleRepo, ProductRepository productRepo) {
        this.saleRepo = saleRepo;
        this.productRepo = productRepo;
    }

    // ===== CREATE =====
    public Sale createSale(Long productId, int qty) {

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (product.getQuantity() < qty) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        product.setQuantity(product.getQuantity() - qty);
        productRepo.save(product);

        Sale sale = new Sale();
        sale.setProductId(product.getId());
        sale.setProductName(product.getName());
        sale.setQuantity(qty);
        sale.setUnitPrice(product.getSellingPrice());
        sale.setTotalAmount(qty * product.getSellingPrice());

        return saleRepo.save(sale);
    }

    // ===== UPDATE =====
    public Sale updateSale(Long id, int newQty) {

        Sale sale = saleRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        Product product = productRepo.findById(sale.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // restore old qty
        product.setQuantity(product.getQuantity() + sale.getQuantity());

        if (product.getQuantity() < newQty) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        product.setQuantity(product.getQuantity() - newQty);
        productRepo.save(product);

        sale.setQuantity(newQty);
        sale.setTotalAmount(newQty * sale.getUnitPrice());

        return saleRepo.save(sale);
    }

    // ===== DELETE =====
    public void deleteSale(Long id) {

        Sale sale = saleRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        Product product = productRepo.findById(sale.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        product.setQuantity(product.getQuantity() + sale.getQuantity());
        productRepo.save(product);

        saleRepo.deleteById(id);
    }

    public List<Sale> getAll() {
        return saleRepo.findAll();
    }
}
