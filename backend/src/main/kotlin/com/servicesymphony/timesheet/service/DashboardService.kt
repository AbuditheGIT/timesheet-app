package com.servicesymphony.timesheet.service

import com.servicesymphony.timesheet.dto.DashboardResponse
import com.servicesymphony.timesheet.dto.UserDto
import com.servicesymphony.timesheet.model.Role
import com.servicesymphony.timesheet.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class DashboardService(
    private val userService: UserService,
    private val projectService: ProjectService,
    private val timesheetService: TimesheetService,
    private val userRepository: UserRepository
) {

    fun getDashboardData(userId: Long): DashboardResponse {
        val user = userService.getUserById(userId)
        val weeklyStats = timesheetService.getWeeklyStats(userId)
        val recentEntries = timesheetService.getRecentEntries(userId)
        val assignedProjects = projectService.getProjectsByUserId(userId)
        
        // Generate reminders based on missing days
        val pendingReminders = weeklyStats.missingDays.map { day ->
            "Missing timesheet entry for $day"
        }

        // Get team members if user is a manager
        val teamMembers = if (user.role == Role.MANAGER || user.role == Role.ADMIN) {
            getTeamMembersForManager(userId)
        } else {
            null
        }

        return DashboardResponse(
            user = user,
            weeklyStats = weeklyStats,
            recentEntries = recentEntries,
            assignedProjects = assignedProjects,
            pendingReminders = pendingReminders,
            teamMembers = teamMembers
        )
    }

    private fun getTeamMembersForManager(managerId: Long): List<UserDto> {
        return userRepository.findTeamMembersByManagerId(managerId)
            .map { user ->
                UserDto(
                    id = user.id,
                    email = user.email,
                    firstName = user.firstName,
                    lastName = user.lastName,
                    fullName = user.getFullName(),
                    role = user.role,
                    teamId = user.team?.id,
                    teamName = user.team?.name,
                    isActive = user.isActive,
                    createdAt = user.createdAt,
                    assignedProjectIds = user.assignedProjects.map { it.id }.toSet()
                )
            }
    }
}