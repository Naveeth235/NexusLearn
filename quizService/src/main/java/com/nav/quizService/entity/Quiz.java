package com.nav.quizService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String category;

    @ElementCollection
    private List<Integer> questionIds;

    private String difficultyLevel; // Easy, Medium, Hard

    private Integer timeLimit; // in minutes

    private Integer passingScore; // percentage (e.g., 70 means 70%)
}

