package com.demo.inventory.service;

import com.demo.inventory.dto.PurchaseResponse;
import com.demo.inventory.model.Purchase;

import java.util.List;

public interface PurchaseService {

    Purchase addPurchase(Long productId, int quantity, double unitPrice, String supplier);

    List<PurchaseResponse> getAll();
}
