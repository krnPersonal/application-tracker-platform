package com.applicationtracker.salary.dto;

public class ZipLocationResponse {
    private boolean valid;
    private String message;
    private String zipCode;
    private String city;
    private String state;
    private String stateCode;
    private String metroAreaCode;
    private String metroAreaName;
    private Double latitude;
    private Double longitude;

    public ZipLocationResponse() {
    }

    public ZipLocationResponse(
            boolean valid,
            String message,
            String zipCode,
            String city,
            String state,
            String stateCode,
            String metroAreaCode,
            String metroAreaName,
            Double latitude,
            Double longitude
    ) {
        this.valid = valid;
        this.message = message;
        this.zipCode = zipCode;
        this.city = city;
        this.state = state;
        this.stateCode = stateCode;
        this.metroAreaCode = metroAreaCode;
        this.metroAreaName = metroAreaName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public String getMetroAreaCode() {
        return metroAreaCode;
    }

    public void setMetroAreaCode(String metroAreaCode) {
        this.metroAreaCode = metroAreaCode;
    }

    public String getMetroAreaName() {
        return metroAreaName;
    }

    public void setMetroAreaName(String metroAreaName) {
        this.metroAreaName = metroAreaName;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
