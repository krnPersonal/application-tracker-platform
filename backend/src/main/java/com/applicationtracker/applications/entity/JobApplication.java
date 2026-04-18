package com.applicationtracker.applications.entity;

import com.applicationtracker.common.entity.BaseEntity;
import com.applicationtracker.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(length = 150)
    private String location;

    @Column(nullable = false, length = 150)
    private String position;

    @Column(length = 50)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Column(nullable = false)
    private Integer yearsExperience = 0;

    private LocalDate availableFrom;

    private LocalDate appliedDate;

    @Column(length = 50)
    private String workType;

    private Integer salaryExpectation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 255)
    private String portfolioUrl;

    @Column(length = 255)
    private String linkedinUrl;

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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDate availableFrom) {
        this.availableFrom = availableFrom;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public Integer getSalaryExpectation() {
        return salaryExpectation;
    }

    public void setSalaryExpectation(Integer salaryExpectation) {
        this.salaryExpectation = salaryExpectation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
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
