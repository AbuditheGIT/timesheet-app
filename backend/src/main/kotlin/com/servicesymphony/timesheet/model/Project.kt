package com.servicesymphony.timesheet.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "projects")
data class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    val name: String,
    
    @Column
    val description: String? = null,
    
    @Column(nullable = false)
    val clientName: String,
    
    @Column(precision = 10, scale = 2)
    val hourlyRate: BigDecimal? = null,
    
    @Column
    val startDate: LocalDate? = null,
    
    @Column
    val endDate: LocalDate? = null,
    
    @Column(nullable = false)
    val isActive: Boolean = true,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @ManyToMany(mappedBy = "assignedProjects", fetch = FetchType.LAZY)
    val assignedUsers: Set<User> = emptySet(),
    
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL])
    val timesheetEntries: List<TimesheetEntry> = emptyList()
)