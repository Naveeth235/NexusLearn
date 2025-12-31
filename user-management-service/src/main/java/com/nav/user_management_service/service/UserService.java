package com.nav.user_management_service.service;

import com.nav.user_management_service.dto.RegisterResponseDTO;
import com.nav.user_management_service.dto.UpdateUserRequestDTO;
import com.nav.user_management_service.dto.UserRequestDTO;
import com.nav.user_management_service.dto.UserResponseDTO;
import com.nav.user_management_service.entity.Role;
import com.nav.user_management_service.entity.User;
import com.nav.user_management_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponseDTO registerUser(UserRequestDTO userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        
        // Auto-assign role based on email domain
        Role userRole;
        if (userRequest.getEmail().endsWith("@nexuslearn.com")) {
            userRole = Role.ADMIN;
        } else {
            userRole = Role.STUDENT;
        }
        user.setRoles(Collections.singleton(userRole));

        User savedUser = userRepository.save(user);
        return new RegisterResponseDTO("User registered successfully!", savedUser.getId());
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
        response.setRoles(user.getRoles());

        return response;
    }

    // ==================== ADMIN-ONLY METHODS ====================

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }

    public String deleteUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setDeleted(true);
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return "User deleted successfully.";
    }

    public String activateUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setActive(true);
        user.setDeleted(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return "User activated successfully.";
    }

    public String deactivateUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return "User deactivated successfully.";
    }

    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setActive(user.isActive());
        dto.setRoles(user.getRoles());
        return dto;
    }
}

