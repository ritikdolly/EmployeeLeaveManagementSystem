package com.demo.employeeleavemangement.service;

import com.demo.employeeleavemangement.model.User;
import com.demo.employeeleavemangement.request.LoginRequest;
import com.demo.employeeleavemangement.request.RegisterRequest;

public interface AuthService {

    User register(RegisterRequest request);

    User login(LoginRequest request);
}
