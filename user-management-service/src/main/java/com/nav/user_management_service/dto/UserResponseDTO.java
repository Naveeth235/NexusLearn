package com.nav.user_management_service.dto;

import com.nav.user_management_service.entity.Role;
import lombok.Data;

import java.util.Set;

@Data
public class UserResponseDTO {
    private String username;
    private String email;
    private String phone;
    private boolean active;
    private Set<Role> roles;
}
