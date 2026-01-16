package com.demo.employeeleavemangement.repository;

import com.demo.employeeleavemangement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(com.demo.employeeleavemangement.model.Role role);
}
