package com.nav.user_management_service.service;

import com.nav.user_management_service.dto.UserRequestDTO;
import com.nav.user_management_service.entity.Role;
import com.nav.user_management_service.entity.User;
import com.nav.user_management_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public String registerUser(UserRequestDTO userRequest) {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRoles(Collections.singleton(Role.USER));

        userRepository.save(user);
        return "User registered successfully!";
    }
}

