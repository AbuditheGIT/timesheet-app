package com.servicesymphony.timesheet.service

import com.servicesymphony.timesheet.dto.LoginRequest
import com.servicesymphony.timesheet.dto.LoginResponse
import com.servicesymphony.timesheet.dto.UserDto
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.repository.UserRepository
import com.servicesymphony.timesheet.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authenticationManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val tokenProvider: JwtTokenProvider
) {

    fun authenticateUser(loginRequest: LoginRequest): LoginResponse {
        println("DEBUG: Starting authentication for email: ${loginRequest.email}")
        
        try {
            val authentication: Authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    loginRequest.email,
                    loginRequest.password
                )
            )
            println("DEBUG: Authentication successful")

            val jwt = tokenProvider.generateToken(authentication)
            println("DEBUG: JWT token generated successfully")

            val user = userRepository.findByEmail(loginRequest.email).get()
            println("DEBUG: User found: ${user.email}")
            
            val userDto = convertToDto(user)
            println("DEBUG: UserDto created successfully")
            
            return LoginResponse(
                token = jwt,
                user = userDto
            )
        } catch (e: Exception) {
            println("DEBUG: Error during authentication: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }

    private fun convertToDto(user: User): UserDto {
        println("DEBUG: Converting user to DTO")
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
            assignedProjectIds = try {
                user.assignedProjects.map { it.id }.toSet()
            } catch (e: Exception) {
                println("DEBUG: Error loading assigned projects: ${e.message}")
                emptySet()
            }
        )
    }
}