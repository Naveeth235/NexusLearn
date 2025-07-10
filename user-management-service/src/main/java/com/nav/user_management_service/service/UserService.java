package com.nav.user_management_service.service;

import com.nav.user_management_service.dto.UpdateUserRequestDTO;
import com.nav.user_management_service.dto.UserRequestDTO;
import com.nav.user_management_service.dto.UserResponseDTO;
import com.nav.user_management_service.entity.Role;
import com.nav.user_management_service.entity.User;
import com.nav.user_management_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;

    public String registerUser(UserRequestDTO userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
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

    public String updateProfile(String email, UpdateUserRequestDTO updatedData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updatedData.getUsername() != null) {
            user.setUsername(updatedData.getUsername());
        }

        if (updatedData.getPhone() != null) {
            user.setPhone(updatedData.getPhone());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return "Profile updated successfully.";
    }

    public String softDeleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setActive(false);
        user.setDeleted(true);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return "User account has been deactivated.";
    }

    public UserResponseDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserResponseDTO response = new UserResponseDTO();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setActive(user.isActive());

        return response;
    }


}

