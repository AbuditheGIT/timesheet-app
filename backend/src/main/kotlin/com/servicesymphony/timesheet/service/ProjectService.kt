package com.servicesymphony.timesheet.service

import com.servicesymphony.timesheet.dto.CreateProjectRequest
import com.servicesymphony.timesheet.dto.ProjectDto
import com.servicesymphony.timesheet.exception.BadRequestException
import com.servicesymphony.timesheet.exception.ResourceNotFoundException
import com.servicesymphony.timesheet.model.Project
import com.servicesymphony.timesheet.repository.ProjectRepository
import com.servicesymphony.timesheet.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository
) {

    fun getAllProjects(): List<ProjectDto> {
        return projectRepository.findAll().map { convertToDto(it) }
    }

    fun getActiveProjects(): List<ProjectDto> {
        return projectRepository.findByIsActiveTrue().map { convertToDto(it) }
    }

    fun getProjectById(id: Long): ProjectDto {
        val project = projectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Project not found with id: $id") }
        return convertToDto(project)
    }

    fun createProject(request: CreateProjectRequest): ProjectDto {
        if (projectRepository.existsByName(request.name)) {
            throw BadRequestException("Project with name '${request.name}' already exists")
        }

        val assignedUsers = if (request.assignedUserIds.isNotEmpty()) {
            userRepository.findAllById(request.assignedUserIds).toSet()
        } else {
            emptySet()
        }

        val project = Project(
            name = request.name,
            description = request.description,
            clientName = request.clientName,
            hourlyRate = request.hourlyRate,
            startDate = request.startDate,
            endDate = request.endDate,
            assignedUsers = assignedUsers
        )

        val savedProject = projectRepository.save(project)
        return convertToDto(savedProject)
    }

    fun getProjectsByUserId(userId: Long): List<ProjectDto> {
        return projectRepository.findActiveProjectsByUserId(userId).map { convertToDto(it) }
    }

    private fun convertToDto(project: Project): ProjectDto {
        return ProjectDto(
            id = project.id,
            name = project.name,
            description = project.description,
            clientName = project.clientName,
            hourlyRate = project.hourlyRate,
            startDate = project.startDate,
            endDate = project.endDate,
            isActive = project.isActive,
            createdAt = project.createdAt,
            assignedUserIds = project.assignedUsers.map { it.id }.toSet()
        )
    }
}