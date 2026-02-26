package com.example.PAF.controller;

import com.example.PAF.model.Resource;
import com.example.PAF.dto.ResourceAnalyticsDTO;
import com.example.PAF.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Managing Facilities & Assets.
 * Follows RESTful principles and layered architecture.
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * GET /api/resources - Get all resources.
     * Public access (no @PreAuthorize) as per SecurityConfig.
     */
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    /**
     * GET /api/resources/search - Advanced search with optional filters.
     * Public access (no @PreAuthorize) as per SecurityConfig.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) com.example.PAF.model.Status status) {

        List<Resource> resources = resourceService.searchResources(type, capacity, location, status);
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/{id} - Get a specific resource by ID.
     * Public access (no @PreAuthorize) as per SecurityConfig.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    /**
     * POST /api/resources - Create a new resource.
     * RESTRICTED: ADMIN only.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    /**
     * PUT /api/resources/{id} - Update an existing resource.
     * RESTRICTED: ADMIN only.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody Resource resource) {

        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    /**
     * DELETE /api/resources/{id} - Remove a resource.
     * RESTRICTED: ADMIN only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/resources/analytics - Get resource distribution and summary
     * analytics.
     * [Innovation Module]: Publicly accessible for Dashboard visibility.
     */
    @GetMapping("/analytics")
    public ResponseEntity<ResourceAnalyticsDTO> getResourceAnalytics() {
        return ResponseEntity.ok(resourceService.getResourceAnalytics());
    }

    /**
     * POST /api/resources/{id}/image - Upload an image for a resource.
     * [Innovation]: Added as a premium feature for Module A.
     */
    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Define storage path
        String uploadDir = "uploads/resources/";
        String fileName = java.util.UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);

        // Create directory if not exists
        java.nio.file.Files.createDirectories(path.getParent());

        // Save file
        java.nio.file.Files.copy(file.getInputStream(), path);

        // Update database (relative URL for frontend)
        String imageUrl = "/uploads/resources/" + fileName;
        return ResponseEntity.ok(resourceService.updateImageUrl(id, imageUrl));
    }
}
