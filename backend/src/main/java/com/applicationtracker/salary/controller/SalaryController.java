package com.applicationtracker.salary.controller;

import com.applicationtracker.salary.dto.SalaryBenchmarkResponse;
import com.applicationtracker.salary.dto.ZipLocationResponse;
import com.applicationtracker.salary.service.BlsSalaryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {
    private final BlsSalaryService blsSalaryService;

    public SalaryController(BlsSalaryService blsSalaryService) {
        this.blsSalaryService = blsSalaryService;
    }

    @GetMapping("/software-developer-benchmark")
    public SalaryBenchmarkResponse getSoftwareDeveloperBenchmark(
            @RequestParam(defaultValue = "US") String location,
            @RequestParam(defaultValue = "") String metroAreaCode,
            @RequestParam(defaultValue = "") String metroAreaName
    ) {
        return blsSalaryService.getSoftwareDeveloperBenchmark(location, metroAreaCode, metroAreaName);
    }

    @GetMapping("/zip-location")
    public ZipLocationResponse getZipLocation(
            @RequestParam String zipCode,
            @RequestParam(defaultValue = "US") String stateCode
    ) {
        return blsSalaryService.getZipLocation(zipCode, stateCode);
    }

    @GetMapping("/city-location")
    public ZipLocationResponse getCityLocation(
            @RequestParam String city,
            @RequestParam String stateCode
    ) {
        return blsSalaryService.getCityLocation(city, stateCode);
    }
}
