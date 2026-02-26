package com.example.PAF.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * Basic controller to handle the root path.
 * Prevents 404/500 errors when accessing the root URL.
 */
@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, String> welcome() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to the SMART Campus API");
        response.put("status", "UP");
        response.put("version", "1.0.0");
        return response;
    }
}
