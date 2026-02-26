package com.example.PAF.repository;

import com.example.PAF.model.Resource;
import com.example.PAF.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Resource entity.
 * Provides standard CRUD, custom search operations, and dynamic specifications.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

    /**
     * Find resources by their type (e.g., 'Lab', 'Lecture Hall').
     */
    List<Resource> findByType(String type);

    /**
     * Find resources with capacity greater than or equal to the specified value.
     */
    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    /**
     * Search for resources by location name (case-insensitive, partial match).
     */
    List<Resource> findByLocationContainingIgnoreCase(String location);

    /**
     * Find resources by their current status (e.g., ACTIVE).
     */
    List<Resource> findByStatus(Status status);
}
