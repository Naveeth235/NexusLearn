package com.nav.quizService.entity;

import lombok.Data;
import java.util.List;

@Data
public class QuizSubmitRequest {
    private String studentId;
    private List<Response> responses;
    private Integer timeTaken;
}
