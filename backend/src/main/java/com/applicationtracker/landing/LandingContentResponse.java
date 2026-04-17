package com.applicationtracker.landing;

import java.util.List;

public record LandingContentResponse(
        String eyebrow,
        String title,
        String accent,
        String subtitle,
        DemoAccount demoAccount,
        List<String> stack,
        List<FeatureCard> features,
        List<ShowcaseItem> showcase,
        List<String> about
) {
    public record DemoAccount(String email, String password) {
    }

    public record FeatureCard(String title, String copy) {
    }

    public record ShowcaseItem(String label, String value) {
    }
}
