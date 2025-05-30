package com.servicesymphony.timesheet.controller

import com.servicesymphony.timesheet.dto.CreateTimesheetEntryRequest
import com.servicesymphony.timesheet.dto.TimesheetEntryDto
import com.servicesymphony.timesheet.model.User
import com.servicesymphony.timesheet.service.TimesheetService
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/timesheet")
@CrossOrigin(origins = ["http://localhost:3000"])
class TimesheetController(
    private val timesheetService: TimesheetService
) {

    @PostMapping
    fun createTimesheetEntry(
        @AuthenticationPrincipal currentUser: User,
        @Valid @RequestBody request: CreateTimesheetEntryRequest
    ): ResponseEntity<TimesheetEntryDto> {
        val entry = timesheetService.createTimesheetEntry(currentUser.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(entry)
    }

    @GetMapping
    fun getTimesheetEntries(
        @AuthenticationPrincipal currentUser: User,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) endDate: LocalDate
    ): ResponseEntity<List<TimesheetEntryDto>> {
        val entries = timesheetService.getTimesheetEntriesByUser(currentUser.id, startDate, endDate)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/date/{date}")
    fun getTimesheetEntriesByDate(
        @AuthenticationPrincipal currentUser: User,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<List<TimesheetEntryDto>> {
        val entries = timesheetService.getTimesheetEntriesByDate(currentUser.id, date)
        return ResponseEntity.ok(entries)
    }

    @GetMapping("/recent")
    fun getRecentEntries(@AuthenticationPrincipal currentUser: User): ResponseEntity<List<TimesheetEntryDto>> {
        val entries = timesheetService.getRecentEntries(currentUser.id)
        return ResponseEntity.ok(entries)
    }
}