package com.nav.user_management_service.dto;

import lombok.Data;

@Data
public class UpdateUserRequestDTO {
    private String username;
    private String phone;
}
