package com.nav.user_management_service.dto;

import com.nav.user_management_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponseDTO {
    private Integer id;
    private String token;
    private String email;
    private String username;
    private Set<Role> roles;
}
