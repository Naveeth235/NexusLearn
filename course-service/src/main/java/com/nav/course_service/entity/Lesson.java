package com.nav.course_service.entity;

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

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;
}
