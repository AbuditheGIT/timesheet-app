package com.servicesymphony.timesheet.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "teams")
data class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    val name: String,
    
    @Column
    val description: String? = null,
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    val manager: User? = null,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @OneToMany(mappedBy = "team", cascade = [CascadeType.ALL])
    val members: List<User> = emptyList()
)