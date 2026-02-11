package com.demo.inventory.service.impl;

import com.demo.inventory.model.Expense;
import com.demo.inventory.repository.ExpenseRepository;
import com.demo.inventory.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public Expense create(Expense expense) {
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }

    @Override
    public Expense update(Long id, Expense incoming) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setTitle(incoming.getTitle());
        expense.setDescription(incoming.getDescription());
        expense.setAmount(incoming.getAmount());
        expense.setDate(incoming.getDate());

        return expenseRepository.save(expense);
    }

    @Override
    public void delete(Long id) {
        expenseRepository.deleteById(id);
    }

    @Override
    public double getTotalExpenses() {
        return expenseRepository.getTotalExpenses();
    }
}
