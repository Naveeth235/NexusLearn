package com.nav.quizService.entity;

import lombok.Data;
import java.util.List;

@Data
public class QuizDTO {
    String categoryName;  // For backward compatibility
    Integer numberOfQuestions;  // For backward compatibility
    String title;
    String description;
    String category;
    String difficultyLevel;
    Integer timeLimit;
    Integer passingScore;
    List<Integer> questionIds;
}
