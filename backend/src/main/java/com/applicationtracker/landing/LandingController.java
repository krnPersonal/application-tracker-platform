package com.applicationtracker.landing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LandingController {
    @GetMapping("/api/public/landing")
    public LandingContentResponse getLandingContent() {
        return new LandingContentResponse(
                "Portfolio project",
                "A polished application tracker with real product workflows.",
                "",
                "ApplicationTracker combines a professional frontend, authenticated user flows, analytics, timelines, file uploads, and production-style backend setup in one full-stack project.",
                new LandingContentResponse.DemoAccount(
                        "demo@applicationtracker.dev",
                        "password123"
                ),
                List.of(
                        "Spring Boot",
                        "Spring Security",
                        "JWT",
                        "MySQL",
                        "Flyway",
                        "Swagger",
                        "React",
                        "Vite"
                ),
                List.of(
                        new LandingContentResponse.FeatureCard(
                                "Pipeline Visibility",
                                "Track every application with status, work type, resume state, and follow-up visibility."
                        ),
                        new LandingContentResponse.FeatureCard(
                                "Portfolio-Grade UX",
                                "Animated auth flow, analytics dashboard, timeline detail views, and responsive product-style layouts."
                        ),
                        new LandingContentResponse.FeatureCard(
                                "Backend Engineering",
                                "JWT auth, Flyway migrations, Swagger docs, demo seed data, and Dockerized backend setup."
                        )
                ),
                List.of(
                        new LandingContentResponse.ShowcaseItem("Auth flow", "JWT + guarded routes"),
                        new LandingContentResponse.ShowcaseItem("Analytics", "response + offer tracking"),
                        new LandingContentResponse.ShowcaseItem("Workflow", "timeline + follow-up queue")
                ),
                List.of(
                        "Feature-first Spring Boot structure",
                        "Flyway migrations instead of ad hoc schema drift",
                        "Dockerized backend setup with MySQL",
                        "Seeded demo data for screenshot-ready local runs"
                )
        );
    }
}
