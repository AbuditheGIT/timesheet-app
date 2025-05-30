package com.servicesymphony.timesheet.controller

import com.servicesymphony.timesheet.dto.DashboardResponse
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.service.DashboardService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = ["http://localhost:3000"])
class DashboardController(
    private val dashboardService: DashboardService
) {

    @GetMapping
    fun getDashboard(@AuthenticationPrincipal currentUser: User): ResponseEntity<DashboardResponse> {
        val dashboard = dashboardService.getDashboardData(currentUser.id)
        return ResponseEntity.ok(dashboard)
    }
}