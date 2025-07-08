package com.nav.user_management_service.controller;

import com.nav.user_management_service.dto.UserRequestDTO;
import com.nav.user_management_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        String response = userService.registerUser(requestDTO);
        return ResponseEntity.ok(response);
    }
}
