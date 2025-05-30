package com.servicesymphony.timesheet.controller

import com.servicesymphony.timesheet.dto.CreateProjectRequest
import com.servicesymphony.timesheet.dto.ProjectDto
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.service.ProjectService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = ["http://localhost:3000"])
class ProjectController(
    private val projectService: ProjectService
) {

    @GetMapping
    fun getAllProjects(): ResponseEntity<List<ProjectDto>> {
        val projects = projectService.getActiveProjects()
        return ResponseEntity.ok(projects)
    }

    @GetMapping("/my")
    fun getMyProjects(@AuthenticationPrincipal currentUser: User): ResponseEntity<List<ProjectDto>> {
        val projects = projectService.getProjectsByUserId(currentUser.id)
        return ResponseEntity.ok(projects)
    }

    @GetMapping("/{id}")
    fun getProjectById(@PathVariable id: Long): ResponseEntity<ProjectDto> {
        val project = projectService.getProjectById(id)
        return ResponseEntity.ok(project)
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createProject(@Valid @RequestBody request: CreateProjectRequest): ResponseEntity<ProjectDto> {
        val project = projectService.createProject(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(project)
    }
}