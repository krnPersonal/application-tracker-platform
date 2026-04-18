package com.applicationtracker.user.controller;

import com.applicationtracker.user.dto.MeResponse;
import com.applicationtracker.user.dto.PasswordUpdateRequest;
import com.applicationtracker.user.dto.ProfileUpdateRequest;
import com.applicationtracker.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/me")
    public MeResponse me(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    @PutMapping("/api/me")
    public MeResponse updateProfile(@Valid @RequestBody ProfileUpdateRequest request,
                                    Authentication authentication) {
        return userService.updateProfile(authentication, request);
    }

    @PutMapping("/api/me/password")
    public void updatePassword(@Valid @RequestBody PasswordUpdateRequest request,
                               Authentication authentication) {
        userService.updatePassword(authentication, request);
    }
}
