package com.demo.employeeleavemangement.serviceImpl;

import com.demo.employeeleavemangement.model.Role;
import com.demo.employeeleavemangement.model.User;
import com.demo.employeeleavemangement.repository.UserRepository;
import com.demo.employeeleavemangement.request.LoginRequest;
import com.demo.employeeleavemangement.request.RegisterRequest;
import com.demo.employeeleavemangement.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    // constructor injection (BEST practice)
    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER
    @Override
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.valueOf(request.getRole()));
        user.setLeaveBalance(request.getLeaveBalance());

        return userRepository.save(user);
    }

    // LOGIN
    @Override
    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
