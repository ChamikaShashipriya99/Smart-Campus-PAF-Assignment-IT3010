package com.example.PAF.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a Campus Resource (Facility or Asset).
 */
@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 0, message = "Capacity cannot be negative")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private Status status;

    private String availabilityStart;
    private String availabilityEnd;
}
