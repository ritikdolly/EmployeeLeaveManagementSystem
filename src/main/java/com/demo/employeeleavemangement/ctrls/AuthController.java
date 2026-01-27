package com.demo.employeeleavemangement.ctrls;

import com.demo.employeeleavemangement.model.User;
import com.demo.employeeleavemangement.model.Role;
import com.demo.employeeleavemangement.request.LoginRequest;
import com.demo.employeeleavemangement.request.RegisterRequest;
import com.demo.employeeleavemangement.service.AuthService;
import com.demo.employeeleavemangement.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    public AuthController(AuthService authService,
            AuthenticationManager authenticationManager,
            UserRepository userRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    // REGISTER API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(),
                            request.getPassword()));

            SecurityContext context = SecurityContextHolder
                    .createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, httpRequest, httpResponse);

            User user = authService.login(request);
            return ResponseEntity.ok(user);
        } catch (org.springframework.security.core.AuthenticationException e) {
            // Return 401 Unauthorized for invalid credentials
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // GET ADMIN CONTACTS (for forgot password)
    @GetMapping("/admin-contacts")
    public ResponseEntity<?> getAdminContacts() {
        java.util.List<User> admins = userRepository.findByRole(Role.MANAGER);
        java.util.List<String> adminEmails = admins.stream()
                .map(User::getEmail)
                .collect(java.util.stream.Collectors.toList());

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("adminEmails", adminEmails);
        response.put("message", "Please contact one of the following administrators to reset your password:");

        return ResponseEntity.ok(response);
    }
}
