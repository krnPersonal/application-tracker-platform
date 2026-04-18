package com.applicationtracker.user.service;

import com.applicationtracker.user.dto.MeResponse;
import com.applicationtracker.user.entity.User;
import com.applicationtracker.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public MeResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                buildFullName(user),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    private String buildFullName(User user) {
        StringBuilder fullName = new StringBuilder(user.getFirstName());

        if (user.getMiddleName() != null && !user.getMiddleName().isBlank()) {
            fullName.append(' ').append(user.getMiddleName().trim());
        }

        fullName.append(' ').append(user.getLastName());
        return fullName.toString().trim();
    }
}
