package com.applicationtracker.applications.dto;

import com.applicationtracker.applications.entity.ApplicationSource;
import com.applicationtracker.applications.entity.ApplicationPriority;
import com.applicationtracker.applications.entity.ApplicationStatus;
import com.applicationtracker.applications.entity.JobType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApplicationResponse {
    private Long id;
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private ApplicationStatus status;
    private ApplicationPriority priority;
    private String jobUrl;
    private ApplicationSource source;
    private LocalDate appliedDate;
    private Integer salaryMin;
    private Integer salaryMax;
    private JobType jobType;
    private String notes;
    private String nextAction;
    private LocalDate nextActionDate;
    private String recruiterName;
    private String recruiterPhone;
    private String recruiterEmail;
    private String coverLetter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resumeFileName;
    private String resumeContentType;
    private Long resumeSize;
    private String resumeCategory;
    private String resumeSubcategory;
    private LocalDateTime resumeUploadedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public ApplicationPriority getPriority() {
        return priority;
    }

    public void setPriority(ApplicationPriority priority) {
        this.priority = priority;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public ApplicationSource getSource() {
        return source;
    }

    public void setSource(ApplicationSource source) {
        this.source = source;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public Integer getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(Integer salaryMin) {
        this.salaryMin = salaryMin;
    }

    public Integer getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(Integer salaryMax) {
        this.salaryMax = salaryMax;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getNextAction() {
        return nextAction;
    }

    public void setNextAction(String nextAction) {
        this.nextAction = nextAction;
    }

    public LocalDate getNextActionDate() {
        return nextActionDate;
    }

    public void setNextActionDate(LocalDate nextActionDate) {
        this.nextActionDate = nextActionDate;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getRecruiterPhone() {
        return recruiterPhone;
    }

    public void setRecruiterPhone(String recruiterPhone) {
        this.recruiterPhone = recruiterPhone;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getResumeContentType() {
        return resumeContentType;
    }

    public void setResumeContentType(String resumeContentType) {
        this.resumeContentType = resumeContentType;
    }

    public Long getResumeSize() {
        return resumeSize;
    }

    public void setResumeSize(Long resumeSize) {
        this.resumeSize = resumeSize;
    }

    public String getResumeCategory() {
        return resumeCategory;
    }

    public void setResumeCategory(String resumeCategory) {
        this.resumeCategory = resumeCategory;
    }

    public String getResumeSubcategory() {
        return resumeSubcategory;
    }

    public void setResumeSubcategory(String resumeSubcategory) {
        this.resumeSubcategory = resumeSubcategory;
    }

    public LocalDateTime getResumeUploadedAt() {
        return resumeUploadedAt;
    }

    public void setResumeUploadedAt(LocalDateTime resumeUploadedAt) {
        this.resumeUploadedAt = resumeUploadedAt;
    }
}
