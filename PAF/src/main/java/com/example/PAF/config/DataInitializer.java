package com.example.PAF.config;

import com.example.PAF.model.Role;
import com.example.PAF.model.User;
import com.example.PAF.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Initialize default users if the table is empty
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_ADMIN)
                        .build();

                User user = User.builder()
                        .username("user")
                        .password(passwordEncoder.encode("user123"))
                        .role(Role.ROLE_USER)
                        .build();

                userRepository.save(admin);
                userRepository.save(user);
                System.out.println("Default users initialized: admin/admin123, user/user123");
            }
        };
    }
}
