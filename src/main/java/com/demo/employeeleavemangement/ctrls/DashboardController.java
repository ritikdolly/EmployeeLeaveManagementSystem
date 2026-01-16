package com.demo.employeeleavemangement.ctrls;

import com.demo.employeeleavemangement.model.LeaveStatus;
import com.demo.employeeleavemangement.model.Role;
import com.demo.employeeleavemangement.model.User;
import com.demo.employeeleavemangement.repository.LeaveRepository;
import com.demo.employeeleavemangement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserRepository userRepository;
    private final LeaveRepository leaveRepository;

    public DashboardController(UserRepository userRepository, LeaveRepository leaveRepository) {
        this.userRepository = userRepository;
        this.leaveRepository = leaveRepository;
    }

    @GetMapping("/manager-stats")
    public ResponseEntity<?> getManagerStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalEmployees", userRepository.countByRole(Role.EMPLOYEE));
            stats.put("pendingRequests", leaveRepository.countByStatus(LeaveStatus.PENDING));
            stats.put("onLeaveToday",
                    leaveRepository.findApprovedLeavesOnDate(LocalDate.now(), LeaveStatus.APPROVED).size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/employee-stats")
    public ResponseEntity<?> getEmployeeStats(@RequestParam Long userId) {
        try {
            // Debug log
            System.out.println("Fetching stats for userId: " + userId);

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found with ID: " + userId);
                return ResponseEntity.status(404).body(error);
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("leaveBalance", user.getLeaveBalance());
            // Use countByUserIdAndStatus (Spring derives this from User entity property)
            stats.put("approvedRequests", leaveRepository.countByUserIdAndStatus(userId, LeaveStatus.APPROVED));
            stats.put("pendingRequests", leaveRepository.countByUserIdAndStatus(userId, LeaveStatus.PENDING));
            stats.put("rejectedRequests", leaveRepository.countByUserIdAndStatus(userId, LeaveStatus.REJECTED));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
