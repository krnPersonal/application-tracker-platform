package com.applicationtracker.common;

import com.applicationtracker.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("Application is running", "OK");
    }
}
