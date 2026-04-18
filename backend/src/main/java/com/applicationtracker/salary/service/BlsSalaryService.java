package com.applicationtracker.salary.service;

import com.applicationtracker.salary.dto.SalaryBenchmarkResponse;
import com.applicationtracker.salary.dto.ZipLocationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class BlsSalaryService {
    private static final Logger log = LoggerFactory.getLogger(BlsSalaryService.class);
    private static final String SOURCE_NAME = "BLS Public Data API";
    private static final String SOURCE_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";
    private static final String ZIP_LOOKUP_URL = "https://api.zippopotam.us/us/";
    private static final String CENSUS_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/geographies/coordinates";
    private static final String OCCUPATION = "Software Developers (SOC 15-1252)";
    private static final String SERIES_PREFIX = "WMU";
    private static final String SERIES_SUFFIX = "1020000001512522500";
    private static final int ANNUAL_HOURS = 2080;
    private static final double FALLBACK_HOURLY_WAGE = 66.69;
    private static final int FALLBACK_YEAR = 2023;

    private static final Map<String, LocationArea> LOCATIONS = new LinkedHashMap<>();

    static {
        LOCATIONS.put("US", new LocationArea("US", "0000000", "United States"));
        LOCATIONS.put("AL", new LocationArea("AL", "0100000", "Alabama"));
        LOCATIONS.put("AK", new LocationArea("AK", "0200000", "Alaska"));
        LOCATIONS.put("AZ", new LocationArea("AZ", "0400000", "Arizona"));
        LOCATIONS.put("AR", new LocationArea("AR", "0500000", "Arkansas"));
        LOCATIONS.put("CA", new LocationArea("CA", "0600000", "California"));
        LOCATIONS.put("CO", new LocationArea("CO", "0800000", "Colorado"));
        LOCATIONS.put("CT", new LocationArea("CT", "0900000", "Connecticut"));
        LOCATIONS.put("DE", new LocationArea("DE", "1000000", "Delaware"));
        LOCATIONS.put("DC", new LocationArea("DC", "1100000", "District of Columbia"));
        LOCATIONS.put("FL", new LocationArea("FL", "1200000", "Florida"));
        LOCATIONS.put("GA", new LocationArea("GA", "1300000", "Georgia"));
        LOCATIONS.put("HI", new LocationArea("HI", "1500000", "Hawaii"));
        LOCATIONS.put("ID", new LocationArea("ID", "1600000", "Idaho"));
        LOCATIONS.put("IL", new LocationArea("IL", "1700000", "Illinois"));
        LOCATIONS.put("IN", new LocationArea("IN", "1800000", "Indiana"));
        LOCATIONS.put("IA", new LocationArea("IA", "1900000", "Iowa"));
        LOCATIONS.put("KS", new LocationArea("KS", "2000000", "Kansas"));
        LOCATIONS.put("KY", new LocationArea("KY", "2100000", "Kentucky"));
        LOCATIONS.put("LA", new LocationArea("LA", "2200000", "Louisiana"));
        LOCATIONS.put("ME", new LocationArea("ME", "2300000", "Maine"));
        LOCATIONS.put("MD", new LocationArea("MD", "2400000", "Maryland"));
        LOCATIONS.put("MA", new LocationArea("MA", "2500000", "Massachusetts"));
        LOCATIONS.put("MI", new LocationArea("MI", "2600000", "Michigan"));
        LOCATIONS.put("MN", new LocationArea("MN", "2700000", "Minnesota"));
        LOCATIONS.put("MS", new LocationArea("MS", "2800000", "Mississippi"));
        LOCATIONS.put("MO", new LocationArea("MO", "2900000", "Missouri"));
        LOCATIONS.put("MT", new LocationArea("MT", "3000000", "Montana"));
        LOCATIONS.put("NE", new LocationArea("NE", "3100000", "Nebraska"));
        LOCATIONS.put("NV", new LocationArea("NV", "3200000", "Nevada"));
        LOCATIONS.put("NH", new LocationArea("NH", "3300000", "New Hampshire"));
        LOCATIONS.put("NJ", new LocationArea("NJ", "3400000", "New Jersey"));
        LOCATIONS.put("NM", new LocationArea("NM", "3500000", "New Mexico"));
        LOCATIONS.put("NY", new LocationArea("NY", "3600000", "New York"));
        LOCATIONS.put("NC", new LocationArea("NC", "3700000", "North Carolina"));
        LOCATIONS.put("ND", new LocationArea("ND", "3800000", "North Dakota"));
        LOCATIONS.put("OH", new LocationArea("OH", "3900000", "Ohio"));
        LOCATIONS.put("OK", new LocationArea("OK", "4000000", "Oklahoma"));
        LOCATIONS.put("OR", new LocationArea("OR", "4100000", "Oregon"));
        LOCATIONS.put("PA", new LocationArea("PA", "4200000", "Pennsylvania"));
        LOCATIONS.put("RI", new LocationArea("RI", "4400000", "Rhode Island"));
        LOCATIONS.put("SC", new LocationArea("SC", "4500000", "South Carolina"));
        LOCATIONS.put("SD", new LocationArea("SD", "4600000", "South Dakota"));
        LOCATIONS.put("TN", new LocationArea("TN", "4700000", "Tennessee"));
        LOCATIONS.put("TX", new LocationArea("TX", "4800000", "Texas"));
        LOCATIONS.put("UT", new LocationArea("UT", "4900000", "Utah"));
        LOCATIONS.put("VT", new LocationArea("VT", "5000000", "Vermont"));
        LOCATIONS.put("VA", new LocationArea("VA", "5100000", "Virginia"));
        LOCATIONS.put("WA", new LocationArea("WA", "5300000", "Washington"));
        LOCATIONS.put("WV", new LocationArea("WV", "5400000", "West Virginia"));
        LOCATIONS.put("WI", new LocationArea("WI", "5500000", "Wisconsin"));
        LOCATIONS.put("WY", new LocationArea("WY", "5600000", "Wyoming"));
    }

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String registrationKey;

    public BlsSalaryService(@Value("${app.bls.registration-key:}") String registrationKey) {
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newHttpClient();
        this.registrationKey = registrationKey;
    }

    public SalaryBenchmarkResponse getSoftwareDeveloperBenchmark(
            String requestedLocation,
            String requestedMetroAreaCode,
            String requestedMetroAreaName
    ) {
        LocationArea location = resolveLocation(requestedLocation);
        LocationArea metroArea = resolveMetroArea(requestedMetroAreaCode, requestedMetroAreaName);

        if (metroArea != null) {
            SalaryFetchResult metroResult = fetchSalaryPoint(buildSeriesId(metroArea.areaCode()));
            if (metroResult.salaryPoint() != null) {
                return response(metroArea, buildSeriesId(metroArea.areaCode()), false, "", metroResult.salaryPoint().year(), metroResult.salaryPoint().hourlyWage());
            }

            SalaryFetchResult stateResult = fetchSalaryPoint(buildSeriesId(location.areaCode()));
            if (stateResult.salaryPoint() != null) {
                return response(
                        location,
                        buildSeriesId(location.areaCode()),
                        false,
                        "Metro wage data was unavailable for " + metroArea.label() + ". Showing " + location.label() + " state benchmark.",
                        stateResult.salaryPoint().year(),
                        stateResult.salaryPoint().hourlyWage()
                );
            }

            return fallback(location, buildSeriesId(location.areaCode()), stateResult.message());
        }

        String seriesId = buildSeriesId(location.areaCode());
        SalaryFetchResult result = fetchSalaryPoint(seriesId);
        if (result.salaryPoint() != null) {
            return response(location, seriesId, false, "", result.salaryPoint().year(), result.salaryPoint().hourlyWage());
        }

        return fallback(location, seriesId, result.message());
    }

    public ZipLocationResponse getZipLocation(String zipCode, String selectedStateCode) {
        String normalizedZipCode = zipCode == null ? "" : zipCode.trim();
        String normalizedSelectedStateCode = selectedStateCode == null
                ? "US"
                : selectedStateCode.trim().toUpperCase(Locale.ROOT);
        if (!normalizedZipCode.matches("\\d{5}")) {
            return invalidZip(normalizedZipCode, "Enter a valid 5-digit US ZIP code.");
        }

        try {
            HttpResponse<String> response = sendGet(ZIP_LOOKUP_URL + normalizedZipCode);

            if (response.statusCode() == 404) {
                return invalidZip(normalizedZipCode, "ZIP code was not found.");
            }
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("ZIP lookup API returned status {}. Body preview: {}",
                        response.statusCode(), preview(response.body()));
                return invalidZip(normalizedZipCode, "ZIP lookup is unavailable right now.");
            }

            ZipLocationResponse location = parseZipLookup(response.body(), normalizedZipCode);
            if (!location.isValid()) {
                return location;
            }
            if (!"US".equals(normalizedSelectedStateCode) && !location.getStateCode().equals(normalizedSelectedStateCode)) {
                String selectedState = LOCATIONS.getOrDefault(normalizedSelectedStateCode, LOCATIONS.get("US")).label();
                return invalidZip(normalizedZipCode, "ZIP code belongs to " + location.getState() + ", not " + selectedState + ".");
            }

            return withMetroArea(location);
        } catch (Exception exception) {
            log.error("ZIP lookup request failed: {}", exception.getMessage(), exception);
            return invalidZip(normalizedZipCode, "ZIP lookup is unavailable right now.");
        }
    }

    public ZipLocationResponse getCityLocation(String city, String selectedStateCode) {
        String normalizedCity = city == null ? "" : city.trim();
        String normalizedSelectedStateCode = selectedStateCode == null
                ? "US"
                : selectedStateCode.trim().toUpperCase(Locale.ROOT);

        if (normalizedCity.length() < 3) {
            return invalidZip("", "Enter at least 3 city characters.");
        }
        if ("US".equals(normalizedSelectedStateCode) || !LOCATIONS.containsKey(normalizedSelectedStateCode)) {
            return invalidZip("", "Select a state before using city-based salary data.");
        }

        try {
            String url = ZIP_LOOKUP_URL
                    + normalizedSelectedStateCode.toLowerCase(Locale.ROOT)
                    + "/"
                    + encode(normalizedCity.toLowerCase(Locale.ROOT));
            HttpResponse<String> response = sendGet(url);

            if (response.statusCode() == 404) {
                return invalidZip("", "City was not found in " + LOCATIONS.get(normalizedSelectedStateCode).label() + ".");
            }
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("City lookup API returned status {}. Body preview: {}",
                        response.statusCode(), preview(response.body()));
                return invalidZip("", "City lookup is unavailable right now.");
            }

            ZipLocationResponse location = parseZipLookup(response.body(), "");
            if (!location.isValid()) {
                return location;
            }
            return withMetroArea(location);
        } catch (Exception exception) {
            log.error("City lookup request failed: {}", exception.getMessage(), exception);
            return invalidZip("", "City lookup is unavailable right now.");
        }
    }

    private SalaryFetchResult fetchSalaryPoint(String seriesId) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(SOURCE_URL))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(buildPayload(seriesId)))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("BLS salary API returned status {}. Body preview: {}",
                        response.statusCode(), preview(response.body()));
                return new SalaryFetchResult(null, "BLS salary API returned status " + response.statusCode() + ".");
            }

            SalaryPoint salaryPoint = parseLatestSalaryPoint(response.body(), seriesId);
            if (salaryPoint == null) {
                log.warn("BLS salary API returned no wage value for series {}. Body preview: {}",
                        seriesId, preview(response.body()));
                return new SalaryFetchResult(null, "BLS salary API returned no wage value.");
            }

            return new SalaryFetchResult(salaryPoint, "");
        } catch (Exception exception) {
            log.error("BLS salary API request failed: {}", exception.getMessage(), exception);
            return new SalaryFetchResult(null, "BLS salary API unavailable. " + exception.getMessage());
        }
    }

    private SalaryPoint parseLatestSalaryPoint(String responseBody, String seriesId) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode series = root.path("Results").path("series");
        if (!series.isArray()) {
            return null;
        }

        for (JsonNode item : series) {
            if (!seriesId.equals(item.path("seriesID").asText())) {
                continue;
            }

            JsonNode data = item.path("data");
            if (!data.isArray() || data.isEmpty()) {
                return null;
            }

            JsonNode latest = data.get(0);
            double hourlyWage = Double.parseDouble(latest.path("value").asText());
            int year = Integer.parseInt(latest.path("year").asText());
            return new SalaryPoint(year, hourlyWage);
        }

        return null;
    }

    private String buildPayload(String seriesId) throws Exception {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("seriesid", new String[]{seriesId});
        if (!registrationKey.isBlank()) {
            payload.put("registrationkey", registrationKey);
        }
        return objectMapper.writeValueAsString(payload);
    }

    private LocationArea resolveLocation(String requestedLocation) {
        String normalized = requestedLocation == null
                ? "US"
                : requestedLocation.trim().toUpperCase(Locale.ROOT);
        return LOCATIONS.getOrDefault(normalized, LOCATIONS.get("US"));
    }

    private LocationArea resolveMetroArea(String requestedMetroAreaCode, String requestedMetroAreaName) {
        String normalizedCode = normalizeMetroAreaCode(requestedMetroAreaCode);
        if (normalizedCode.isBlank()) {
            return null;
        }

        String label = requestedMetroAreaName == null || requestedMetroAreaName.isBlank()
                ? "Metro area"
                : requestedMetroAreaName.trim();
        return new LocationArea(normalizedCode, normalizedCode, label, "Metro");
    }

    private String normalizeMetroAreaCode(String metroAreaCode) {
        if (metroAreaCode == null) {
            return "";
        }
        String digits = metroAreaCode.replaceAll("\\D", "");
        if (digits.length() == 5) {
            return "00" + digits;
        }
        if (digits.length() == 7) {
            return digits;
        }
        return "";
    }

    private ZipLocationResponse parseZipLookup(String responseBody, String fallbackZipCode) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode firstPlace = root.path("places").isArray() && !root.path("places").isEmpty()
                ? root.path("places").get(0)
                : null;
        if (firstPlace == null) {
            return invalidZip(fallbackZipCode, "Location lookup returned no city.");
        }

        String stateCode = firstPlace.path("state abbreviation").asText("").toUpperCase(Locale.ROOT);
        if (!LOCATIONS.containsKey(stateCode)) {
            return invalidZip(fallbackZipCode, "Location is outside the supported US state list.");
        }

        return new ZipLocationResponse(
                true,
                "",
                root.path("post code").asText(fallbackZipCode),
                firstPlace.path("place name").asText(""),
                firstPlace.path("state").asText(""),
                stateCode,
                "",
                "",
                parseNullableDouble(firstPlace.path("latitude").asText("")),
                parseNullableDouble(firstPlace.path("longitude").asText(""))
        );
    }

    private ZipLocationResponse withMetroArea(ZipLocationResponse location) {
        MetroArea metroArea = resolveCensusMetroArea(location.getLatitude(), location.getLongitude());
        if (metroArea == null) {
            location.setMessage("No metro area was found for this location. Salary will use the state benchmark.");
            return location;
        }

        location.setMetroAreaCode(metroArea.code());
        location.setMetroAreaName(metroArea.name());
        location.setMessage("Metro salary benchmark available for " + metroArea.name() + ".");
        return location;
    }

    private MetroArea resolveCensusMetroArea(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return null;
        }

        try {
            String url = CENSUS_GEOCODER_URL
                    + "?x=" + longitude
                    + "&y=" + latitude
                    + "&benchmark=Public_AR_Current"
                    + "&vintage=Current_Current"
                    + "&layers=Metropolitan%20Statistical%20Areas"
                    + "&format=json";
            HttpResponse<String> response = sendGet(url);
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Census geocoder returned status {}. Body preview: {}",
                        response.statusCode(), preview(response.body()));
                return null;
            }

            JsonNode geographies = objectMapper.readTree(response.body())
                    .path("result")
                    .path("geographies");
            JsonNode metroAreas = geographies.path("Metropolitan Statistical Areas");
            if (!metroAreas.isArray() || metroAreas.isEmpty()) {
                return null;
            }

            JsonNode firstMetro = metroAreas.get(0);
            String code = firstMetro.path("GEOID").asText("");
            String name = firstMetro.path("NAME").asText("");
            if (code.isBlank() || name.isBlank()) {
                return null;
            }

            return new MetroArea(code, name);
        } catch (Exception exception) {
            log.warn("Census metro lookup failed: {}", exception.getMessage());
            return null;
        }
    }

    private String buildSeriesId(String areaCode) {
        return SERIES_PREFIX + areaCode + SERIES_SUFFIX;
    }

    private ZipLocationResponse invalidZip(String zipCode, String message) {
        return new ZipLocationResponse(false, message, zipCode, "", "", "", "", "", null, null);
    }

    private Double parseNullableDouble(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private SalaryBenchmarkResponse fallback(LocationArea location, String seriesId, String message) {
        return response(location, seriesId, true, message, FALLBACK_YEAR, FALLBACK_HOURLY_WAGE);
    }

    private SalaryBenchmarkResponse response(
            LocationArea location,
            String seriesId,
            boolean usingFallback,
            String message,
            int year,
            double hourlyWage
    ) {
        return new SalaryBenchmarkResponse(
                SOURCE_NAME,
                SOURCE_URL,
                usingFallback,
                message,
                location.code(),
                location.label(),
                location.geographyLevel(),
                seriesId,
                OCCUPATION,
                year,
                hourlyWage,
                (int) Math.round(hourlyWage * ANNUAL_HOURS)
        );
    }

    private String preview(String value) {
        if (value == null || value.isBlank()) {
            return "<empty>";
        }
        String normalized = value.replaceAll("\\s+", " ").trim();
        return normalized.length() > 300 ? normalized.substring(0, 300) + "..." : normalized;
    }

    private HttpResponse<String> sendGet(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .GET()
                .build();
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private record LocationArea(String code, String areaCode, String label, String geographyLevel) {
        private LocationArea(String code, String areaCode, String label) {
            this(code, areaCode, label, "State");
        }
    }

    private record SalaryPoint(int year, double hourlyWage) {
    }

    private record SalaryFetchResult(SalaryPoint salaryPoint, String message) {
    }

    private record MetroArea(String code, String name) {
    }
}
