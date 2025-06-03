package com.servicesymphony.timesheet.repository

import com.servicesymphony.timesheet.model.Project
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ProjectRepository : JpaRepository<Project, Long> {
    
    fun findByIsActiveTrue(): List<Project>
    
    fun existsByName(name: String): Boolean
    
    @Query("SELECT p FROM Project p JOIN p.assignedUsers u WHERE u.id = :userId AND p.isActive = true")
    fun findActiveProjectsByUserId(@Param("userId") userId: Long): List<Project>
}