package com.example.PAF.security;

import com.example.PAF.model.Role;
import com.example.PAF.model.User;
import com.example.PAF.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null) {
            throw new ServletException("Email not found from Google OAuth2 provider");
        }

        if (name == null || name.isBlank()) {
            name = email.split("@")[0];
        }

        // Find or create user
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Create a new user if not exists
            user = User.builder()
                    .username(email) // Using email as username for OAuth2 users
                    .email(email)
                    .name(name)
                    .password("OAUTH2_USER_" + System.currentTimeMillis()) // Satisfy @NotBlank
                    .role(Role.ROLE_USER)
                    .build();
            userRepository.save(user);
        }

        // Generate JWT (using email as subject)
        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getUsername(), "N/A", authentication.getAuthorities()));

        // Redirect to frontend with token info
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")
                .queryParam("token", token)
                .queryParam("username", user.getUsername())
                .queryParam("role", user.getRole().name())
                .queryParam("name", user.getName())
                .queryParam("email", user.getEmail())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
