package com.demo.inventory.service;

import com.demo.inventory.model.Product;
import java.util.List;

public interface ProductService {

    Product create(Product product);

    List<Product> getAll();

    Product update(Long id, Product product);

    void delete(Long id);
}
