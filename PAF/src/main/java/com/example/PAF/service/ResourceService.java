package com.example.PAF.service;

import com.example.PAF.exception.ResourceNotFoundException;
import com.example.PAF.model.Resource;
import com.example.PAF.repository.ResourceRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.example.PAF.dto.ResourceAnalyticsDTO;
import com.example.PAF.model.Status;

/**
 * Service class for managing Campus Resources.
 * Contains business logic and acts as an intermediary between Controller and
 * Repository.
 */
@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    /**
     * Constructor Injection (Best Practice):
     * Spring automatically injects the ResourceRepository bean.
     * Field injection (@Autowired on fields) is discouraged for better testability
     * and immutability.
     */
    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    /**
     * Creates a new resource.
     */
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    /**
     * Retrieves all available resources.
     */
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    /**
     * Retrieves a single resource by ID.
     * Throws ResourceNotFoundException if ID does not exist.
     */
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    /**
     * Updates an existing resource.
     */
    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existingResource = getResourceById(id);

        existingResource.setName(updatedResource.getName());
        existingResource.setType(updatedResource.getType());
        existingResource.setCapacity(updatedResource.getCapacity());
        existingResource.setLocation(updatedResource.getLocation());
        existingResource.setStatus(updatedResource.getStatus());
        existingResource.setAvailabilityStart(updatedResource.getAvailabilityStart());
        existingResource.setAvailabilityEnd(updatedResource.getAvailabilityEnd());

        return resourceRepository.save(existingResource);
    }

    /**
     * Updates only the image URL for a resource.
     */
    public Resource updateImageUrl(Long id, String imageUrl) {
        Resource resource = getResourceById(id);
        resource.setImageUrl(imageUrl);
        return resourceRepository.save(resource);
    }

    /**
     * Deletes a resource by ID.
     */
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    /**
     * Advanced searching for resources based on filters.
     * Supports combination of parameters using JPA Specifications.
     */
    public List<Resource> searchResources(String type, Integer capacity, String location, Status status) {
        return resourceRepository.findAll((Specification<Resource>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null && !type.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            if (capacity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), capacity));
            }

            if (location != null && !location.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }

    /**
     * Aggregates resource data for the Analytics Dashboard.
     * [Innovation Module]: Demonstrates data processing and visualization readiness.
     */
    public ResourceAnalyticsDTO getResourceAnalytics() {
        List<Resource> allResources = resourceRepository.findAll();

        long total = allResources.size();
        long active = allResources.stream()
                .filter(r -> r.getStatus() == Status.ACTIVE)
                .count();
        long outOfService = total - active;

        Map<String, Long> byType = allResources.stream()
                .collect(Collectors.groupingBy(Resource::getType, Collectors.counting()));

        return ResourceAnalyticsDTO.builder()
                .totalResources(total)
                .activeResources(active)
                .outOfServiceResources(outOfService)
                .resourcesByType(byType)
                .build();
    }
}
