package com.applicationtracker.applications.service;

import com.applicationtracker.applications.dto.ApplicationCreateRequest;
import com.applicationtracker.applications.dto.ApplicationResponse;
import com.applicationtracker.applications.dto.ApplicationUpdateRequest;
import com.applicationtracker.applications.entity.ApplicationPriority;
import com.applicationtracker.applications.entity.ApplicationStatus;
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
        application.setJobTitle(request.getJobTitle().trim());
        application.setCompanyName(request.getCompanyName().trim());
        application.setJobLocation(trimToNull(request.getJobLocation()));
        application.setStatus(request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED);
        application.setPriority(request.getPriority() != null ? request.getPriority() : ApplicationPriority.MEDIUM);
        application.setJobUrl(trimToNull(request.getJobUrl()));
        application.setSource(request.getSource());
        application.setCoverLetter(trimToNull(request.getCoverLetter()));
        application.setAppliedDate(request.getAppliedDate());
        application.setSalaryMin(request.getSalaryMin());
        application.setSalaryMax(request.getSalaryMax());
        application.setJobType(request.getJobType());
        application.setNotes(trimToNull(request.getNotes()));
        application.setNextAction(trimToNull(request.getNextAction()));
        application.setNextActionDate(request.getNextActionDate());
        application.setRecruiterName(trimToNull(request.getRecruiterName()));
        application.setRecruiterPhone(trimToNull(request.getRecruiterPhone()));
        application.setRecruiterEmail(normalizeEmail(request.getRecruiterEmail()));
        application.setResumeFileName(trimToNull(request.getResumeFileName()));
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

        if (request.getJobTitle() != null && !request.getJobTitle().isBlank()) {
            application.setJobTitle(request.getJobTitle().trim());
        }
        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            application.setCompanyName(request.getCompanyName().trim());
        }
        if (request.getJobLocation() != null) {
            application.setJobLocation(trimToNull(request.getJobLocation()));
        }
        if (request.getStatus() != null) {
            application.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            application.setPriority(request.getPriority());
        }
        if (request.getJobUrl() != null) {
            application.setJobUrl(trimToNull(request.getJobUrl()));
        }
        if (request.getSource() != null) {
            application.setSource(request.getSource());
        }
        if (request.getCoverLetter() != null) {
            application.setCoverLetter(trimToNull(request.getCoverLetter()));
        }
        if (request.getAppliedDate() != null) {
            application.setAppliedDate(request.getAppliedDate());
        }
        if (request.getSalaryMin() != null) {
            application.setSalaryMin(request.getSalaryMin());
        }
        if (request.getSalaryMax() != null) {
            application.setSalaryMax(request.getSalaryMax());
        }
        if (request.getJobType() != null) {
            application.setJobType(request.getJobType());
        }
        if (request.getNotes() != null) {
            application.setNotes(trimToNull(request.getNotes()));
        }
        if (request.getNextAction() != null) {
            application.setNextAction(trimToNull(request.getNextAction()));
        }
        if (request.getNextActionDate() != null) {
            application.setNextActionDate(request.getNextActionDate());
        }
        if (request.getRecruiterName() != null) {
            application.setRecruiterName(trimToNull(request.getRecruiterName()));
        }
        if (request.getRecruiterPhone() != null) {
            application.setRecruiterPhone(trimToNull(request.getRecruiterPhone()));
        }
        if (request.getRecruiterEmail() != null) {
            application.setRecruiterEmail(normalizeEmail(request.getRecruiterEmail()));
        }
        if (request.getResumeFileName() != null) {
            application.setResumeFileName(trimToNull(request.getResumeFileName()));
        }

        return toResponse(jobApplicationRepository.save(application));
    }

    public void delete(Long id, Authentication authentication) {
        jobApplicationRepository.delete(getOwnedApplication(id, authentication));
    }

    private ApplicationResponse toResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setJobTitle(application.getJobTitle());
        response.setCompanyName(application.getCompanyName());
        response.setJobLocation(application.getJobLocation());
        response.setStatus(application.getStatus());
        response.setPriority(application.getPriority());
        response.setJobUrl(application.getJobUrl());
        response.setSource(application.getSource());
        response.setCoverLetter(application.getCoverLetter());
        response.setAppliedDate(application.getAppliedDate());
        response.setSalaryMin(application.getSalaryMin());
        response.setSalaryMax(application.getSalaryMax());
        response.setJobType(application.getJobType());
        response.setNotes(application.getNotes());
        response.setNextAction(application.getNextAction());
        response.setNextActionDate(application.getNextActionDate());
        response.setRecruiterName(application.getRecruiterName());
        response.setRecruiterPhone(application.getRecruiterPhone());
        response.setRecruiterEmail(application.getRecruiterEmail());
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

    private String normalizeEmail(String value) {
        String trimmed = trimToNull(value);
        return trimmed == null ? null : trimmed.toLowerCase();
    }
}
