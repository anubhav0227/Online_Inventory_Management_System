package com.demo.inventory.service.impl;

import com.demo.inventory.model.Product;
import com.demo.inventory.repository.ProductRepository;
import com.demo.inventory.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ===== CREATE =====
    @Override
    public Product create(Product product) {
        return productRepository.save(product);
    }

    // ===== READ =====
    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // ===== UPDATE =====
    @Override
    public Product update(Long id, Product updated) {

        Product existing = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(updated.getName());
        existing.setSku(updated.getSku());
        existing.setCostPrice(updated.getCostPrice());
        existing.setSellingPrice(updated.getSellingPrice());
        existing.setQuantity(updated.getQuantity());

        return productRepository.save(existing);
    }

    // ===== DELETE =====
    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
