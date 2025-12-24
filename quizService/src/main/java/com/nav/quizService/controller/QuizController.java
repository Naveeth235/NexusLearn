package com.nav.quizService.controller;


import com.nav.quizService.entity.QuestionWrapper;
import com.nav.quizService.entity.Quiz;
import com.nav.quizService.entity.QuizDTO;
import com.nav.quizService.entity.Response;
import com.nav.quizService.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @PostMapping
    public ResponseEntity<String> createQuiz(@RequestBody QuizDTO quizdto) {
        return quizService.createQuiz(quizdto.getCategoryName(), quizdto.getNumberOfQuestions(), quizdto.getTitle());
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id) {
        return quizService.getQuizQuestions(id);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id, @RequestBody List<Response> responses) {
        return quizService.calculateResult(id, responses);
    }
}
