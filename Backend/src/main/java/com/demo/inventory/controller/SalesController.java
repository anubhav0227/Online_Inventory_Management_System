package com.demo.inventory.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.inventory.dto.SaleRequest;
import com.demo.inventory.model.Sale;
import com.demo.inventory.service.SaleService;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SaleService saleService;

    public SalesController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<Sale> getAll() {
        return saleService.getAll();
    }

    @PostMapping
    public Sale create(@RequestBody SaleRequest body) {

        if (body.getProductId() == null || body.getQuantity() == null) {
            throw new RuntimeException("productId and quantity are required");
        }

        return saleService.createSale(
            body.getProductId(),
            body.getQuantity()
        );
    }


    @PutMapping("/{id}")
    public Sale update(
        @PathVariable Long id,
        @RequestBody Map<String, Integer> body
    ) {
        return saleService.updateSale(id, body.get("quantity"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        saleService.deleteSale(id);
    }
}
