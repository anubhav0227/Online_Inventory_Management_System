package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.model.Expense;
import com.demo.inventory.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // CREATE
    @PostMapping
    public ApiResponse<?> create(@RequestBody Expense expense) {
        return ApiResponse.success(
                "Expense Added",
                expenseService.create(expense)
        );
    }

    // READ
    @GetMapping
    public ApiResponse<?> getAll() {
        return ApiResponse.success(
                "Fetched All Expenses",
                expenseService.getAll()
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ApiResponse<?> update(
            @PathVariable Long id,
            @RequestBody Expense expense
    ) {
        return ApiResponse.success(
                "Expense Updated",
                expenseService.update(id, expense)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ApiResponse.success("Expense Deleted", null);
    }
}
