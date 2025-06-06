package com.servicesymphony.timesheet.service

import com.servicesymphony.timesheet.dto.CreateTimesheetEntryRequest
import com.servicesymphony.timesheet.dto.TimesheetEntryDto
import com.servicesymphony.timesheet.dto.WeeklyStats
import com.servicesymphony.timesheet.exception.BadRequestException
import com.servicesymphony.timesheet.exception.ResourceNotFoundException
import com.servicesymphony.timesheet.model.TimesheetEntry
import com.servicesymphony.timesheet.model.Role
import com.servicesymphony.timesheet.repository.ProjectRepository
import com.servicesymphony.timesheet.repository.TimesheetEntryRepository
import com.servicesymphony.timesheet.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAdjusters

@Service
@Transactional
class TimesheetService(
    private val timesheetEntryRepository: TimesheetEntryRepository,
    private val userRepository: UserRepository,
    private val projectRepository: ProjectRepository
) {

    fun createTimesheetEntry(userId: Long, request: CreateTimesheetEntryRequest): TimesheetEntryDto {
        // Use the new method that fetches projects eagerly
        val user = userRepository.findByIdWithProjects(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }

        val project = projectRepository.findById(request.projectId)
            .orElseThrow { ResourceNotFoundException("Project not found with id: ${request.projectId}") }

        // DEBUG: Let's see what's happening
        println("DEBUG: User ID: ${user.id}, Email: ${user.email}, Role: ${user.role}")
        println("DEBUG: Project ID: ${project.id}, Name: ${project.name}")
        println("DEBUG: User assigned projects count: ${user.assignedProjects.size}")
        println("DEBUG: User assigned project IDs: ${user.assignedProjects.map { it.id }}")
        println("DEBUG: Requested project ID: ${request.projectId}")

        // Role-based project access check
        val canAccessProject = when (user.role) {
            Role.ADMIN, Role.MANAGER -> {
                // Admins and Managers can log time to any active project
                println("DEBUG: Admin/Manager can access any project")
                project.isActive
            }
            Role.TEAM_MEMBER -> {
                // Team members can only log time to assigned projects
                val hasAccess = user.assignedProjects.contains(project)
                println("DEBUG: Team member access check: $hasAccess")
                hasAccess
            }
        }

        if (!canAccessProject) {
            when (user.role) {
                Role.ADMIN, Role.MANAGER -> {
                    throw BadRequestException("Cannot log time to inactive project: ${project.name}")
                }
                Role.TEAM_MEMBER -> {
                    throw BadRequestException("User is not assigned to project: ${project.name}")
                }
            }
        }

        // Check if entry already exists for this user/project/date
        if (timesheetEntryRepository.existsByUserIdAndProjectIdAndDate(userId, request.projectId, request.date)) {
            throw BadRequestException("Timesheet entry already exists for this date and project")
        }

        val timesheetEntry = TimesheetEntry(
            user = user,
            project = project,
            date = request.date,
            hours = request.hours,
            notes = request.notes
        )

        val savedEntry = timesheetEntryRepository.save(timesheetEntry)
        return convertToDto(savedEntry)
    }

    fun getTimesheetEntriesByUser(userId: Long, startDate: LocalDate, endDate: LocalDate): List<TimesheetEntryDto> {
        return timesheetEntryRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
            .map { convertToDto(it) }
    }

    fun getTimesheetEntriesByDate(userId: Long, date: LocalDate): List<TimesheetEntryDto> {
        return timesheetEntryRepository.findByUserIdAndDate(userId, date)
            .map { convertToDto(it) }
    }

    fun getWeeklyStats(userId: Long): WeeklyStats {
        val today = LocalDate.now()
        val startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        val endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY))

        val entries = timesheetEntryRepository.findByUserIdAndDateBetween(userId, startOfWeek, endOfWeek)
        val totalHours = entries.sumOf { it.hours }
        
        val loggedDates = timesheetEntryRepository.findDistinctDatesByUserIdAndDateBetween(userId, startOfWeek, endOfWeek)
        val daysLogged = loggedDates.size

        val missingDays = mutableListOf<String>()
        var currentDate = startOfWeek
        while (!currentDate.isAfter(endOfWeek)) {
            if (!loggedDates.contains(currentDate)) {
                missingDays.add(currentDate.format(DateTimeFormatter.ofPattern("EEEE, MMM dd")))
            }
            currentDate = currentDate.plusDays(1)
        }

        return WeeklyStats(
            totalHours = totalHours,
            daysLogged = daysLogged,
            missingDays = missingDays
        )
    }

    fun getRecentEntries(userId: Long, limit: Int = 5): List<TimesheetEntryDto> {
        val endDate = LocalDate.now()
        val startDate = endDate.minusDays(30) // Last 30 days
        
        return timesheetEntryRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
            .sortedByDescending { it.date }
            .take(limit)
            .map { convertToDto(it) }
    }

    private fun convertToDto(entry: TimesheetEntry): TimesheetEntryDto {
        return TimesheetEntryDto(
            id = entry.id,
            userId = entry.user.id,
            userFullName = entry.user.getFullName(),
            projectId = entry.project.id,
            projectName = entry.project.name,
            clientName = entry.project.clientName,
            date = entry.date,
            hours = entry.hours,
            notes = entry.notes,
            createdAt = entry.createdAt,
            updatedAt = entry.updatedAt
        )
    }
}