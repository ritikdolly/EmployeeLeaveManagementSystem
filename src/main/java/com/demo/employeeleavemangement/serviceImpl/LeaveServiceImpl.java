package com.demo.employeeleavemangement.serviceImpl;

import com.demo.employeeleavemangement.model.LeaveRequest;
import com.demo.employeeleavemangement.model.LeaveStatus;
import com.demo.employeeleavemangement.model.User;
import com.demo.employeeleavemangement.repository.LeaveRepository;
import com.demo.employeeleavemangement.repository.UserRepository;
import com.demo.employeeleavemangement.service.LeaveService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    public LeaveServiceImpl(LeaveRepository leaveRepository, UserRepository userRepository) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LeaveRequest applyLeave(LeaveRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (days <= 0) { // Should be covered by date check, but safety first
            throw new RuntimeException("Invalid date range");
        }

        // Optional: Check balance here itself or wait for approval?
        // Requirement: "Automatically deduct leave days when a leave request is
        // approved."
        // So we just submit here.

        request.setUser(user);
        request.setStatus(LeaveStatus.PENDING);

        // Ensure other fields are set if needed
        return leaveRepository.save(request);
    }

    @Override
    public List<LeaveRequest> getMyLeaves(Long userId) {
        return leaveRepository.findByUserId(userId);
    }

    @Override
    public List<LeaveRequest> getPendingLeaves() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING);
    }

    @Override
    public List<LeaveRequest> getApprovedLeaves() {
        return leaveRepository.findByStatus(LeaveStatus.APPROVED);
    }

    @Override
    @Transactional
    public LeaveRequest approveLeave(Long leaveId, Long managerId) {
        LeaveRequest request = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not pending");
        }

        // Self-approval check
        if (request.getUser().getId().equals(managerId)) {
            throw new RuntimeException("Managers cannot approve their own leave requests");
        }

        User user = request.getUser();
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        if (user.getLeaveBalance() < days) {
            // Optional: Reject if insufficient balance, or allow negative?
            // Requirement says "Maintain leave balances... Automatically deduct... "
            // Implies we should check balance.
            throw new RuntimeException("Insufficient leave balance");
        }

        user.setLeaveBalance((int) (user.getLeaveBalance() - days));
        userRepository.save(user);

        request.setStatus(LeaveStatus.APPROVED);
        request.setManagerComment("Approved"); // Or pass from controller
        return leaveRepository.save(request);
    }

    @Override
    @Transactional
    public LeaveRequest rejectLeave(Long leaveId, Long managerId) {
        LeaveRequest request = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not pending");
        }

        // Self-reject is probably fine? But let's keep it consistent if needed.
        // Requirement only says "approve", but let's assume standard workflow.

        request.setStatus(LeaveStatus.REJECTED);
        request.setManagerComment("Rejected");
        return leaveRepository.save(request);
    }
}
