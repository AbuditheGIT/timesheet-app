package com.servicesymphony.timesheet.controller

import com.servicesymphony.timesheet.dto.CreateUserRequest
import com.servicesymphony.timesheet.dto.UserDto
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["http://localhost:3000"])
class UserController(
    private val userService: UserService
) {

    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal currentUser: User): ResponseEntity<UserDto> {
        val userDto = userService.getUserById(currentUser.id)
        return ResponseEntity.ok(userDto)
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    fun getAllUsers(): ResponseEntity<List<UserDto>> {
        val users = userService.getActiveUsers()
        return ResponseEntity.ok(users)
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserDto> {
        val user = userService.getUserById(id)
        return ResponseEntity.ok(user)
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createUser(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserDto> {
        val user = userService.createUser(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }
}