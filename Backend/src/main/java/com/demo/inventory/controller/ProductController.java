package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.model.Product;
import com.demo.inventory.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ================= CREATE =================
    @PostMapping
    public ApiResponse<?> create(@RequestBody Product product) {
        return ApiResponse.success(
                "Product Created",
                productService.create(product)
        );
    }

    // ================= READ =================
    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.success(
                "Fetched All Products",
                productService.getAll()
        );
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ApiResponse<?> update(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        return ApiResponse.success(
                "Product Updated",
                productService.update(id, product)
        );
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        productService.delete(id);
        return ApiResponse.success("Product Deleted", null);
    }
}
