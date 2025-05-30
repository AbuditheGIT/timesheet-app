package com.servicesymphony.timesheet.repository

import com.servicesymphony.timesheet.model.Role
import com.servicesymphony.timesheet.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun findByIsActiveTrue(): List<User>
    fun findByRole(role: Role): List<User>
    fun findByTeamId(teamId: Long): List<User>
    
    @Query("SELECT u FROM User u WHERE u.team.manager.id = :managerId")
    fun findTeamMembersByManagerId(@Param("managerId") managerId: Long): List<User>
    
    fun existsByEmail(email: String): Boolean
}