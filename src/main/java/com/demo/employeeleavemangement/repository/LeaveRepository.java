package com.demo.employeeleavemangement.repository;

import com.demo.employeeleavemangement.model.LeaveRequest;
import com.demo.employeeleavemangement.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserId(Long userId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    List<LeaveRequest> findByStatusAndUserIdNot(LeaveStatus status, Long userId); // For finding pending requests not by
                                                                                  // me (if needed) but manager can see
                                                                                  // all usually, just can't approve
                                                                                  // own.
}
