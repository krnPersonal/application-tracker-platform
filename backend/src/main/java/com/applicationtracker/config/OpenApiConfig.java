package com.applicationtracker.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI applicationTrackerOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Application Tracker API")
                        .description("API documentation for the Application Tracker platform")
                        .version("v1.0"))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation"));
    }
}
