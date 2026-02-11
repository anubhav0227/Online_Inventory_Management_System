package com.demo.inventory.controller;

import com.demo.inventory.dto.ApiResponse;
import com.demo.inventory.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // GET /dashboard/summary
    @GetMapping("/summary")
    public ApiResponse<?> summary() {
        return ApiResponse.success(
                "Fetched Dashboard Data",
                dashboardService.getSummary()
        );
    }
}
