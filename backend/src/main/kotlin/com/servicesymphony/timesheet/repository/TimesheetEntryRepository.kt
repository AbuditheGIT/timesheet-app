package com.servicesymphony.timesheet.repository

import com.servicesymphony.timesheet.model.TimesheetEntry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface TimesheetEntryRepository : JpaRepository<TimesheetEntry, Long> {
    
    fun findByUserIdAndDateBetween(userId: Long, startDate: LocalDate, endDate: LocalDate): List<TimesheetEntry>
    
    fun findByUserIdAndDate(userId: Long, date: LocalDate): List<TimesheetEntry>
    
    fun findByProjectIdAndDateBetween(projectId: Long, startDate: LocalDate, endDate: LocalDate): List<TimesheetEntry>
    
    @Query("SELECT te FROM TimesheetEntry te WHERE te.user.id IN :userIds AND te.date BETWEEN :startDate AND :endDate")
    fun findByUserIdsAndDateBetween(
        @Param("userIds") userIds: List<Long>,
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): List<TimesheetEntry>
    
    @Query("SELECT te FROM TimesheetEntry te WHERE te.date BETWEEN :startDate AND :endDate")
    fun findByDateBetween(@Param("startDate") startDate: LocalDate, @Param("endDate") endDate: LocalDate): List<TimesheetEntry>
    
    @Query("SELECT DISTINCT te.date FROM TimesheetEntry te WHERE te.user.id = :userId AND te.date BETWEEN :startDate AND :endDate")
    fun findDistinctDatesByUserIdAndDateBetween(
        @Param("userId") userId: Long,
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): List<LocalDate>
    
    fun existsByUserIdAndProjectIdAndDate(userId: Long, projectId: Long, date: LocalDate): Boolean
}