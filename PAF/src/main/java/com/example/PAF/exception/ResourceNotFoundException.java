package com.example.PAF.exception;

/**
 * Custom exception to be thrown when a Resource is not found.
 * Centralized handling is managed by GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
