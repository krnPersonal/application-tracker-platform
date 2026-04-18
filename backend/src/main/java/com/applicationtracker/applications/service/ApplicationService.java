package com.applicationtracker.applications.service;

import com.applicationtracker.applications.dto.ApplicationCreateRequest;
import com.applicationtracker.applications.dto.ApplicationResponse;
import com.applicationtracker.applications.dto.ApplicationUpdateRequest;
import com.applicationtracker.applications.entity.JobApplication;
import com.applicationtracker.applications.repository.JobApplicationRepository;
import com.applicationtracker.user.entity.User;
import com.applicationtracker.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ApplicationService {
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public ApplicationService(JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public ApplicationResponse create(ApplicationCreateRequest request, Authentication authentication) {
        User user = getUserOrThrow(authentication);

        JobApplication application = new JobApplication();
        application.setFullName(request.getFullName().trim());
        application.setEmail(request.getEmail().trim().toLowerCase());
        application.setPhone(trimToNull(request.getPhone()));
        application.setPosition(request.getPosition().trim());
        application.setStatus(trimToNull(request.getStatus()) != null ? request.getStatus().trim() : "APPLIED");
        application.setCoverLetter(trimToNull(request.getCoverLetter()));
        application.setYearsExperience(request.getYearsExperience() != null ? request.getYearsExperience() : 0);
        application.setAvailableFrom(request.getAvailableFrom());
        application.setAppliedDate(request.getAppliedDate());
        application.setWorkType(trimToNull(request.getWorkType()));
        application.setSalaryExpectation(request.getSalaryExpectation());
        application.setNotes(trimToNull(request.getNotes()));
        application.setPortfolioUrl(trimToNull(request.getPortfolioUrl()));
        application.setLinkedinUrl(trimToNull(request.getLinkedinUrl()));
        application.setRemoteOk(Boolean.TRUE.equals(request.getRemoteOk()));
        application.setUser(user);

        return toResponse(jobApplicationRepository.save(application));
    }

    public List<ApplicationResponse> list(Authentication authentication) {
        User user = getUserOrThrow(authentication);
        return jobApplicationRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse getById(Long id, Authentication authentication) {
        return toResponse(getOwnedApplication(id, authentication));
    }

    public ApplicationResponse update(Long id, ApplicationUpdateRequest request, Authentication authentication) {
        JobApplication application = getOwnedApplication(id, authentication);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            application.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            application.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (request.getPhone() != null) {
            application.setPhone(trimToNull(request.getPhone()));
        }
        if (request.getPosition() != null && !request.getPosition().isBlank()) {
            application.setPosition(request.getPosition().trim());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            application.setStatus(request.getStatus().trim());
        }
        if (request.getCoverLetter() != null) {
            application.setCoverLetter(trimToNull(request.getCoverLetter()));
        }
        if (request.getYearsExperience() != null) {
            application.setYearsExperience(request.getYearsExperience());
        }
        if (request.getAvailableFrom() != null) {
            application.setAvailableFrom(request.getAvailableFrom());
        }
        if (request.getAppliedDate() != null) {
            application.setAppliedDate(request.getAppliedDate());
        }
        if (request.getWorkType() != null) {
            application.setWorkType(trimToNull(request.getWorkType()));
        }
        if (request.getSalaryExpectation() != null) {
            application.setSalaryExpectation(request.getSalaryExpectation());
        }
        if (request.getNotes() != null) {
            application.setNotes(trimToNull(request.getNotes()));
        }
        if (request.getPortfolioUrl() != null) {
            application.setPortfolioUrl(trimToNull(request.getPortfolioUrl()));
        }
        if (request.getLinkedinUrl() != null) {
            application.setLinkedinUrl(trimToNull(request.getLinkedinUrl()));
        }
        if (request.getRemoteOk() != null) {
            application.setRemoteOk(request.getRemoteOk());
        }

        return toResponse(jobApplicationRepository.save(application));
    }

    public void delete(Long id, Authentication authentication) {
        jobApplicationRepository.delete(getOwnedApplication(id, authentication));
    }

    private ApplicationResponse toResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setFullName(application.getFullName());
        response.setEmail(application.getEmail());
        response.setPhone(application.getPhone());
        response.setPosition(application.getPosition());
        response.setStatus(application.getStatus());
        response.setCoverLetter(application.getCoverLetter());
        response.setYearsExperience(application.getYearsExperience());
        response.setAvailableFrom(application.getAvailableFrom());
        response.setAppliedDate(application.getAppliedDate());
        response.setWorkType(application.getWorkType());
        response.setSalaryExpectation(application.getSalaryExpectation());
        response.setNotes(application.getNotes());
        response.setPortfolioUrl(application.getPortfolioUrl());
        response.setLinkedinUrl(application.getLinkedinUrl());
        response.setRemoteOk(application.getRemoteOk());
        response.setCreatedAt(application.getCreatedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        response.setResumeFileName(application.getResumeFileName());
        response.setResumeContentType(application.getResumeContentType());
        response.setResumeSize(application.getResumeSize());
        response.setResumeCategory(application.getResumeCategory());
        response.setResumeSubcategory(application.getResumeSubcategory());
        response.setResumeUploadedAt(application.getResumeUploadedAt());
        return response;
    }

    private User getUserOrThrow(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private JobApplication getOwnedApplication(Long id, Authentication authentication) {
        User user = getUserOrThrow(authentication);
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your application");
        }

        return application;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
