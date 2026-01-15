package com.demo.employeeleavemangement.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;        // EMPLOYEE / MANAGER
    private int leaveBalance;
}

