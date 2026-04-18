package com.applicationtracker.salary.dto;

public class SalaryBenchmarkResponse {
    private String sourceName;
    private String sourceUrl;
    private boolean usingFallback;
    private String message;
    private String location;
    private String locationLabel;
    private String geographyLevel;
    private String seriesId;
    private String occupation;
    private Integer year;
    private Double hourlyWage;
    private Integer annualSalary;

    public SalaryBenchmarkResponse(
            String sourceName,
            String sourceUrl,
            boolean usingFallback,
            String message,
            String location,
            String locationLabel,
            String geographyLevel,
            String seriesId,
            String occupation,
            Integer year,
            Double hourlyWage,
            Integer annualSalary
    ) {
        this.sourceName = sourceName;
        this.sourceUrl = sourceUrl;
        this.usingFallback = usingFallback;
        this.message = message;
        this.location = location;
        this.locationLabel = locationLabel;
        this.geographyLevel = geographyLevel;
        this.seriesId = seriesId;
        this.occupation = occupation;
        this.year = year;
        this.hourlyWage = hourlyWage;
        this.annualSalary = annualSalary;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public boolean isUsingFallback() {
        return usingFallback;
    }

    public void setUsingFallback(boolean usingFallback) {
        this.usingFallback = usingFallback;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLocationLabel() {
        return locationLabel;
    }

    public void setLocationLabel(String locationLabel) {
        this.locationLabel = locationLabel;
    }

    public String getGeographyLevel() {
        return geographyLevel;
    }

    public void setGeographyLevel(String geographyLevel) {
        this.geographyLevel = geographyLevel;
    }

    public String getSeriesId() {
        return seriesId;
    }

    public void setSeriesId(String seriesId) {
        this.seriesId = seriesId;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getHourlyWage() {
        return hourlyWage;
    }

    public void setHourlyWage(Double hourlyWage) {
        this.hourlyWage = hourlyWage;
    }

    public Integer getAnnualSalary() {
        return annualSalary;
    }

    public void setAnnualSalary(Integer annualSalary) {
        this.annualSalary = annualSalary;
    }
}
