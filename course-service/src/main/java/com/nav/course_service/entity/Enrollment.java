package com.nav.course_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId; // from user-service

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties("chapters")
    private Course course;

    private LocalDateTime enrolledAt;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    @Builder.Default
    private Integer progress = 0; // Progress percentage (0-100)

    private LocalDateTime lastAccessedAt;

    private Integer completedLessons;
}
