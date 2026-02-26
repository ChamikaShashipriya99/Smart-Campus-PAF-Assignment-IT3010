package com.example.PAF.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for resource distribution and summary analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceAnalyticsDTO {
    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;
    private Map<String, Long> resourcesByType;
}
