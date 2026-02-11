package com.demo.inventory.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    private int quantity;
    private double unitPrice;
    private double totalAmount;

    private String supplierName;

    private Instant date = Instant.now();

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getUnitPrice() { return unitPrice; }
    public double getTotalAmount() { return totalAmount; }
    public String getSupplierName() { return supplierName; }
    public Instant getDate() { return date; }

    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
}
