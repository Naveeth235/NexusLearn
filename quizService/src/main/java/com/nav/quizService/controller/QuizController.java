package com.nav.quizService.controller;


import com.nav.quizService.entity.QuestionWrapper;
import com.nav.quizService.entity.Quiz;
import com.nav.quizService.entity.QuizAttempt;
import com.nav.quizService.entity.QuizDTO;
import com.nav.quizService.entity.QuizSubmitRequest;
import com.nav.quizService.entity.Response;
import com.nav.quizService.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Integer id) {
        return quizService.getQuizById(id);
    }

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody QuizDTO quizdto) {
        // Check if this is a new-style quiz with explicit questionIds
        if (quizdto.getQuestionIds() != null && !quizdto.getQuestionIds().isEmpty()) {
            return quizService.createQuizWithDetails(quizdto);
        }
        // Otherwise, use the old method for backward compatibility
        return quizService.createQuiz(quizdto.getCategoryName(), quizdto.getNumberOfQuestions(), quizdto.getTitle());
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id) {
        return quizService.getQuizQuestions(id);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @PathVariable Integer id, 
            @RequestBody QuizSubmitRequest request) {
        
        return quizService.submitQuiz(
            id, 
            request.getStudentId(), 
            request.getResponses(), 
            request.getTimeTaken()
        );
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<QuizAttempt>> getQuizHistory(@PathVariable String studentId) {
        return quizService.getQuizHistory(studentId);
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<QuizAttempt> getQuizAttemptById(@PathVariable Long attemptId) {
        return quizService.getQuizAttemptById(attemptId);
    }

    @GetMapping("/{quizId}/attempts")
    public ResponseEntity<List<QuizAttempt>> getQuizAttemptsByQuiz(@PathVariable Integer quizId) {
        return quizService.getQuizAttemptsByQuiz(quizId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(@PathVariable Integer id, @RequestBody QuizDTO quizDTO) {
        return quizService.updateQuiz(id, quizDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id) {
        return quizService.deleteQuiz(id);
    }

    // Keep the old endpoint for backward compatibility
    @PostMapping("/{id}/calculate")
    public ResponseEntity<Integer> calculateResult(@PathVariable Integer id, @RequestBody List<Response> responses) {
        return quizService.calculateResult(id, responses);
    }
}

