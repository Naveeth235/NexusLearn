package com.nav.quizService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quizId;

    private String studentId; // from user-service

    private Integer score; // percentage (0-100)

    private Integer correctAnswers;

    private Integer totalQuestions;

    @ElementCollection
    @CollectionTable(name = "quiz_attempt_responses", joinColumns = @JoinColumn(name = "attempt_id"))
    private List<UserResponse> userResponses;

    private LocalDateTime attemptedAt;

    private Integer timeTaken; // in seconds

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Integer questionId;
        private String selectedAnswer; // option1, option2, etc.
        private Boolean isCorrect;
    }
}
