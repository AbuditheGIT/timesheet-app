package com.servicesymphony.timesheet.model

import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(unique = true, nullable = false)
    val email: String = "",
    
    @Column(nullable = false)
    val firstName: String = "",
    
    @Column(nullable = false)
    val lastName: String = "",
    
    @Column(nullable = false)
    private val password: String = "",
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: Role = Role.TEAM_MEMBER,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    val team: Team? = null,
    
    @Column(nullable = false)
    val isActive: Boolean = true,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val timesheetEntries: List<TimesheetEntry> = emptyList(),
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_projects",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "project_id")]
    )
    val assignedProjects: Set<Project> = emptySet()
) : UserDetails {
    
    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }
    
    override fun getPassword(): String = password
    override fun getUsername(): String = email
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = isActive
    
    fun getFullName(): String = "$firstName $lastName"
}

enum class Role {
    ADMIN, MANAGER, TEAM_MEMBER
}