package com.servicesymphony.timesheet.controller

import com.servicesymphony.timesheet.dto.LoginRequest
import com.servicesymphony.timesheet.dto.LoginResponse
import com.servicesymphony.timesheet.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = ["http://localhost:3000"])
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.authenticateUser(loginRequest)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/logout")
    fun logoutUser(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("message" to "User logged out successfully"))
    }
}