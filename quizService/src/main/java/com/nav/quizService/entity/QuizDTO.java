package com.nav.quizService.entity;

import lombok.Data;

@Data
public class QuizDTO {
    String categoryName;
    Integer numberOfQuestions;
    String title;
}
