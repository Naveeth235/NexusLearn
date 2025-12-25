package com.nav.course_service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String category;

    private String instructor;

    private Double rating;

    private String duration; // e.g., "27 hours"

    private String imageUrl;

    private String level; // Beginner, Intermediate, Advanced

    private Integer enrolledStudents;

    @Column(length = 500)
    private String prerequisites; // Comma-separated or JSON

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Chapter> chapters;
}
