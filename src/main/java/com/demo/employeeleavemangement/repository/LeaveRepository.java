package com.demo.employeeleavemangement.repository;

import com.demo.employeeleavemangement.model.LeaveRequest;
import com.demo.employeeleavemangement.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserId(Long userId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    List<LeaveRequest> findByStatusAndUserIdNot(LeaveStatus status, Long userId);

    long countByStatus(LeaveStatus status);

    long countByUserIdAndStatus(Long userId, LeaveStatus status);

    List<LeaveRequest> findByStatusNot(LeaveStatus status);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = :status AND l.startDate <= :date AND l.endDate >= :date")
    List<LeaveRequest> findApprovedLeavesOnDate(
            @Param("date") java.time.LocalDate date,
            @Param("status") LeaveStatus status);

    @Query("SELECT COUNT(l) > 0 FROM LeaveRequest l WHERE l.user.id = :userId AND l.status != 'REJECTED' AND ((l.startDate BETWEEN :startDate AND :endDate) OR (l.endDate BETWEEN :startDate AND :endDate) OR (:startDate BETWEEN l.startDate AND l.endDate))")
    boolean existsOverlappingLeave(
            @Param("userId") Long userId,
            @Param("startDate") java.time.LocalDate startDate,
            @Param("endDate") java.time.LocalDate endDate);
}
