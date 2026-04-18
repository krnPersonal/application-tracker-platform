package com.applicationtracker.user.controller;

import com.applicationtracker.user.dto.MeResponse;
import com.applicationtracker.user.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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
}
