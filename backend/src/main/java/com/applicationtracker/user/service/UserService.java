package com.applicationtracker.user.service;

import com.applicationtracker.user.dto.MeResponse;
import com.applicationtracker.user.dto.PasswordUpdateRequest;
import com.applicationtracker.user.dto.ProfileUpdateRequest;
import com.applicationtracker.user.entity.User;
import com.applicationtracker.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public MeResponse getCurrentUser(Authentication authentication) {
        User user = getUserOrThrow(authentication);

        return mapToMeResponse(user);
    }

    public MeResponse updateProfile(Authentication authentication, ProfileUpdateRequest request) {
        User user = getUserOrThrow(authentication);

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName().trim());
        }
        if (request.getMiddleName() != null) {
            user.setMiddleName(request.getMiddleName().isBlank() ? null : request.getMiddleName().trim());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().isBlank() ? null : request.getPhone().trim());
        }
        if (request.getTitle() != null) {
            user.setTitle(request.getTitle().isBlank() ? null : request.getTitle().trim());
        }

        userRepository.save(user);
        return mapToMeResponse(user);
    }

    public void updatePassword(Authentication authentication, PasswordUpdateRequest request) {
        User user = getUserOrThrow(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getUserOrThrow(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private MeResponse mapToMeResponse(User user) {
        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                buildFullName(user),
                user.getPhone(),
                user.getTitle(),
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
