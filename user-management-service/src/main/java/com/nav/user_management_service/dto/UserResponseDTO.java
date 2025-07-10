package com.nav.user_management_service.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String username;
    private String email;
    private String phone;
    private boolean active;
}
