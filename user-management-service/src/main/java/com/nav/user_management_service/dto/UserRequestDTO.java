package com.nav.user_management_service.dto;

import com.nav.user_management_service.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequestDTO {

    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phone;
    
    private Role role; // STUDENT, TUTOR, or ADMIN
}
