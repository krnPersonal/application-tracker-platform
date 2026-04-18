package com.applicationtracker.applications.entity;

import com.applicationtracker.common.entity.BaseEntity;
import com.applicationtracker.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication extends BaseEntity {
    @Column(nullable = false, length = 150)
    private String jobTitle;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(length = 150)
    private String jobLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationPriority priority = ApplicationPriority.MEDIUM;

    @Column(length = 500)
    private String jobUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ApplicationSource source;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    private LocalDate appliedDate;

    private Integer salaryMin;

    private Integer salaryMax;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private JobType jobType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 255)
    private String nextAction;

    private LocalDate nextActionDate;

    @Column(length = 150)
    private String recruiterName;

    @Column(length = 50)
    private String recruiterPhone;

    @Column(length = 255)
    private String recruiterEmail;

    @Column(length = 255)
    private String resumeFileName;

    @Column(length = 255)
    private String resumeStorageName;

    @Column(length = 500)
    private String resumePath;

    @Column(length = 150)
    private String resumeContentType;

    private Long resumeSize;

    @Column(length = 100)
    private String resumeCategory;

    @Column(length = 100)
    private String resumeSubcategory;

    private LocalDateTime resumeUploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public ApplicationPriority getPriority() {
        return priority;
    }

    public void setPriority(ApplicationPriority priority) {
        this.priority = priority;
    }

    public ApplicationSource getSource() {
        return source;
    }

    public void setSource(ApplicationSource source) {
        this.source = source;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
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

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getResumeStorageName() {
        return resumeStorageName;
    }

    public void setResumeStorageName(String resumeStorageName) {
        this.resumeStorageName = resumeStorageName;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
