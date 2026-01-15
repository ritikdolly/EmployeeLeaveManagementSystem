package com.demo.employeeleavemangement.ctrls;

import com.demo.employeeleavemangement.model.LeaveRequest;
import com.demo.employeeleavemangement.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest request, @RequestParam Long userId) {
        try {
            LeaveRequest saved = leaveService.applyLeave(request, userId);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(@RequestParam Long userId) {
        return ResponseEntity.ok(leaveService.getMyLeaves(userId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<LeaveRequest>> getApprovedLeaves() {
        return ResponseEntity.ok(leaveService.getApprovedLeaves());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id, @RequestParam Long managerId) {
        try {
            LeaveRequest approved = leaveService.approveLeave(id, managerId);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id, @RequestParam Long managerId) {
        try {
            LeaveRequest rejected = leaveService.rejectLeave(id, managerId);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
