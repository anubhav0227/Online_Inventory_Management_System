package com.demo.inventory.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String sku;

    private double costPrice;
    private double sellingPrice;
    private int quantity;

    private Instant createdAt = Instant.now();

    // ===== getters & setters =====
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSku() { return sku; }
    public double getCostPrice() { return costPrice; }
    public double getSellingPrice() { return sellingPrice; }
    public int getQuantity() { return quantity; }
    public Instant getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSku(String sku) { this.sku = sku; }
    public void setCostPrice(double costPrice) { this.costPrice = costPrice; }
    public void setSellingPrice(double sellingPrice) { this.sellingPrice = sellingPrice; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
