package com.servicesymphony.timesheet.service

import com.servicesymphony.timesheet.dto.CreateUserRequest
import com.servicesymphony.timesheet.dto.UserDto
import com.servicesymphony.timesheet.exception.BadRequestException
import com.servicesymphony.timesheet.exception.ResourceNotFoundException
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.repository.ProjectRepository
import com.servicesymphony.timesheet.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val projectRepository: ProjectRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun getAllUsers(): List<UserDto> {
        return userRepository.findAll().map { convertToDto(it) }
    }

    fun getUserById(id: Long): UserDto {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found with id: $id") }
        return convertToDto(user)
    }

    fun createUser(request: CreateUserRequest): UserDto {
        if (userRepository.existsByEmail(request.email)) {
            throw BadRequestException("User with email ${request.email} already exists")
        }

        val projects = if (request.assignedProjectIds.isNotEmpty()) {
            projectRepository.findAllById(request.assignedProjectIds).toSet()
        } else {
            emptySet()
        }

        val user = User(
            email = request.email,
            firstName = request.firstName,
            lastName = request.lastName,
            password = passwordEncoder.encode(request.password),
            role = request.role,
            assignedProjects = projects
        )

        val savedUser = userRepository.save(user)
        return convertToDto(savedUser)
    }

    fun getActiveUsers(): List<UserDto> {
        return userRepository.findByIsActiveTrue().map { convertToDto(it) }
    }

    private fun convertToDto(user: User): UserDto {
        return UserDto(
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