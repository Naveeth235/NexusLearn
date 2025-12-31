package com.nav.course_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 3000)
    private String content; // For text

    private String videoUrl; // Optional

    private String duration; // e.g., "15min", "30min"

    @Enumerated(EnumType.STRING)
    private LessonType type; // VIDEO, READING, QUIZ

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @JsonBackReference
    private Chapter chapter;
}
