package com.servicesymphony.timesheet.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ProjectDto(
    val id: Long,
    val name: String,
    val description: String?,
    val clientName: String,
    val hourlyRate: BigDecimal?,
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val isActive: Boolean,
    val createdAt: LocalDateTime,
    val assignedUserIds: Set<Long>
)

data class CreateProjectRequest(
    @field:NotBlank(message = "Project name is required")
    val name: String,
    
    val description: String?,
    
    @field:NotBlank(message = "Client name is required")
    val clientName: String,
    
    @field:Positive(message = "Hourly rate must be positive")
    val hourlyRate: BigDecimal?,
    
    val startDate: LocalDate?,
    val endDate: LocalDate?,
    val assignedUserIds: Set<Long> = emptySet()
)