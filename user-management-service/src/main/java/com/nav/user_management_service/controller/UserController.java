package com.nav.user_management_service.controller;

import com.nav.user_management_service.dto.*;
import com.nav.user_management_service.service.UserService;
import com.nav.user_management_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    // ==================== PUBLIC ENDPOINTS ====================

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> registerUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        RegisterResponseDTO response = userService.registerUser(requestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ==================== STUDENT & ADMIN ENDPOINTS ====================

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getProfile(Principal principal) {
        UserResponseDTO user = userService.getProfile(principal.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateUserRequestDTO request, Principal principal) {
        String response = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteAccount(Principal principal) {
        String response = userService.softDeleteUser(principal.getName());
        return ResponseEntity.ok(response);
    }

    // ==================== ADMIN-ONLY ENDPOINTS ====================

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUserByAdmin(@PathVariable Integer id) {
        String response = userService.deleteUserById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateUser(@PathVariable Integer id) {
        String response = userService.activateUser(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateUser(@PathVariable Integer id) {
        String response = userService.deactivateUser(id);
        return ResponseEntity.ok(response);
    }
}
