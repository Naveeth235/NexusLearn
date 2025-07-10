package com.nav.user_management_service.controller;

import com.nav.user_management_service.dto.LoginRequestDTO;
import com.nav.user_management_service.dto.LoginResponseDTO;
import com.nav.user_management_service.dto.UpdateUserRequestDTO;
import com.nav.user_management_service.dto.UserRequestDTO;
import com.nav.user_management_service.service.UserService;
import com.nav.user_management_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;
    @Autowired
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        String response = userService.registerUser(requestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
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

}
