package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.dto.PurchaseRequest;
import com.demo.inventory.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ApiResponse<?> add(@RequestBody PurchaseRequest request) {
        return ApiResponse.success(
                "Purchase Added Successfully",
                purchaseService.addPurchase(
                        request.getProductId(),
                        request.getQuantity(),
                        request.getCostPrice(),
                        request.getSupplierName()
                )
        );
    }

    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.success(
                "Fetched All Purchases",
                purchaseService.getAll()
        );
    }
}
