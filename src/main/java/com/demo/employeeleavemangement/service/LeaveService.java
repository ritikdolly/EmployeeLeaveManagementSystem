package com.demo.employeeleavemangement.service;

import com.demo.employeeleavemangement.model.LeaveRequest;

import java.util.List;

public interface LeaveService {
    LeaveRequest applyLeave(LeaveRequest request, Long userId);

    List<LeaveRequest> getMyLeaves(Long userId);

    List<LeaveRequest> getPendingLeaves();

    List<LeaveRequest> getApprovedLeaves();

    List<LeaveRequest> getLeavesHistory();

    LeaveRequest approveLeave(Long leaveId, Long managerId, String comment);

    LeaveRequest rejectLeave(Long leaveId, Long managerId, String comment);
}
