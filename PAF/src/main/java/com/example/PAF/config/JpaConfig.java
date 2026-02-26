package com.example.PAF.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

/**
 * Configuration for JPA Auditing.
 */
@Configuration
public class JpaConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        // In a real app, this would get the username from SecurityContextHolder
        return () -> Optional.of("Member 1");
    }
}
