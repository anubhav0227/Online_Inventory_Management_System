package com.demo.inventory.service;

import com.demo.inventory.model.Expense;
import java.util.List;

public interface ExpenseService {

    Expense create(Expense expense);

    List<Expense> getAll();

    Expense update(Long id, Expense expense);

    void delete(Long id);

    double getTotalExpenses();
}
