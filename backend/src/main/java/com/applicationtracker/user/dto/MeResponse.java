package com.applicationtracker.user.dto;

import java.time.LocalDateTime;

public record MeResponse(
        Long id,
        String email,
        String firstName,
        String middleName,
        String lastName,
        String fullName,
        String role,
        LocalDateTime createdAt
) {
}
