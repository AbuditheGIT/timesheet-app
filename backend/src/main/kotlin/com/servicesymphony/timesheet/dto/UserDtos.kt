package com.servicesymphony.timesheet.dto

import com.servicesymphony.timesheet.model.Role
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class UserDto(
    val id: Long,
    val email: String,
    val firstName: String,
    val lastName: String,
    val fullName: String,
    val role: Role,
    val teamId: Long?,
    val teamName: String?,
    val isActive: Boolean,
    val createdAt: LocalDateTime,
    val assignedProjectIds: Set<Long>
)

data class CreateUserRequest(
    @field:Email(message = "Please provide a valid email address")
    @field:NotBlank(message = "Email is required")
    val email: String,
    
    @field:NotBlank(message = "First name is required")
    val firstName: String,
    
    @field:NotBlank(message = "Last name is required")
    val lastName: String,
    
    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String,
    
    val role: Role = Role.TEAM_MEMBER,
    val teamId: Long? = null,
    val assignedProjectIds: Set<Long> = emptySet()
)