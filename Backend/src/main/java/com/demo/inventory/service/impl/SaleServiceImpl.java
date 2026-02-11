//package com.demo.inventory.service.impl;
//
//import org.springframework.stereotype.Service;
//
//@Service
//public class SaleServiceImpl {
//
//    private final SaleRepository saleRepo;
//    private final ProductRepository productRepo;
//
//    public SaleServiceImpl(SaleRepository saleRepo, ProductRepository productRepo) {
//        this.saleRepo = saleRepo;
//        this.productRepo = productRepo;
//    }
//
//    // ===== CREATE =====
//    public Sale createSale(Long productId, int qty) {
//
//        Product product = productRepo.findById(productId)
//            .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        if (product.getQuantity() < qty) {
//            throw new RuntimeException("Insufficient stock");
//        }
//
//        product.setQuantity(product.getQuantity() - qty);
//        productRepo.save(product);
//
//        Sale sale = new Sale();
//        sale.setProductId(product.getId());
//        sale.setProductName(product.getName());
//        sale.setQuantity(qty);
//        sale.setUnitPrice(product.getSellingPrice());
//        sale.setTotalAmount(qty * product.getSellingPrice());
//
//        return saleRepo.save(sale);
//    }
//
//    // ===== UPDATE =====
//    public Sale updateSale(Long id, int newQty) {
//
//        Sale sale = saleRepo.findById(id)
//            .orElseThrow(() -> new RuntimeException("Sale not found"));
//
//        Product product = productRepo.findById(sale.getProductId())
//            .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        // restore old qty
//        product.setQuantity(product.getQuantity() + sale.getQuantity());
//
//        if (product.getQuantity() < newQty) {
//            throw new RuntimeException("Insufficient stock");
//        }
//
//        // apply new qty
//        product.setQuantity(product.getQuantity() - newQty);
//        productRepo.save(product);
//
//        sale.setQuantity(newQty);
//        sale.setTotalAmount(newQty * sale.getUnitPrice());
//
//        return saleRepo.save(sale);
//    }
//
//    // ===== DELETE =====
//    public void deleteSale(Long id) {
//
//        Sale sale = saleRepo.findById(id)
//            .orElseThrow(() -> new RuntimeException("Sale not found"));
//
//        Product product = productRepo.findById(sale.getProductId())
//            .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        // restore stock
//        product.setQuantity(product.getQuantity() + sale.getQuantity());
//        productRepo.save(product);
//
//        saleRepo.deleteById(id);
//    }
//
//    public List<Sale> getAll() {
//        return saleRepo.findAll();
//    }
//}
