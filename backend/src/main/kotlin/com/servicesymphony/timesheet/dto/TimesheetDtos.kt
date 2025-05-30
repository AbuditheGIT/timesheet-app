package com.servicesymphony.timesheet.dto

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class TimesheetEntryDto(
    val id: Long,
    val userId: Long,
    val userFullName: String,
    val projectId: Long,
    val projectName: String,
    val clientName: String,
    val date: LocalDate,
    val hours: BigDecimal,
    val notes: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class CreateTimesheetEntryRequest(
    @field:NotNull(message = "Project ID is required")
    val projectId: Long,
    
    @field:NotNull(message = "Date is required")
    val date: LocalDate,
    
    @field:NotNull(message = "Hours is required")
    @field:Positive(message = "Hours must be positive")
    val hours: BigDecimal,
    
    val notes: String?
)

data class DashboardResponse(
    val user: UserDto,
    val weeklyStats: WeeklyStats,
    val recentEntries: List<TimesheetEntryDto>,
    val assignedProjects: List<ProjectDto>,
    val pendingReminders: List<String>,
    val teamMembers: List<UserDto>? = null // Only for managers/admins
)

data class WeeklyStats(
    val totalHours: BigDecimal,
    val daysLogged: Int,
    val missingDays: List<String>
)