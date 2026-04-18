package com.applicationtracker.applications.controller;

import com.applicationtracker.applications.dto.ApplicationCreateRequest;
import com.applicationtracker.applications.dto.ApplicationResponse;
import com.applicationtracker.applications.dto.ApplicationUpdateRequest;
import com.applicationtracker.applications.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ApplicationResponse create(@Valid @RequestBody ApplicationCreateRequest request,
                                      Authentication authentication) {
        return applicationService.create(request, authentication);
    }

    @GetMapping
    public List<ApplicationResponse> list(Authentication authentication) {
        return applicationService.list(authentication);
    }

    @GetMapping("/{id}")
    public ApplicationResponse getById(@PathVariable Long id, Authentication authentication) {
        return applicationService.getById(id, authentication);
    }

    @PutMapping("/{id}")
    public ApplicationResponse update(@PathVariable Long id,
                                      @Valid @RequestBody ApplicationUpdateRequest request,
                                      Authentication authentication) {
        return applicationService.update(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        applicationService.delete(id, authentication);
    }
}
