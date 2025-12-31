package com.nav.questionService.controller;

import com.nav.questionService.entity.Question;
import com.nav.questionService.entity.QuestionWrapper;
import com.nav.questionService.entity.Response;
import com.nav.questionService.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/allQuestions")
    public ResponseEntity<List<Question>> getAllQuestionsAlias() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Integer id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Question>> getQuestionsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(questionService.getQuestionsByCategory(category));
    }

    @PostMapping
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.addQuestion(question));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Integer id,
                                                   @RequestBody Question question) {
        Question updated = questionService.updateQuestion(id, question);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/generate")
    public ResponseEntity<List<Integer>> getQuestionsForQuiz
            (@RequestParam String categoryName, @RequestParam Integer numberOfQuestions) {
        return questionService.getQuestionsForQuiz(categoryName, numberOfQuestions);
    }

    @PostMapping("/by-ids")
    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(@RequestBody List<Integer> questionIds) {
        return questionService.getQuestionsFromId(questionIds);
    }

    @PostMapping("/score")
    public ResponseEntity<Integer> getScore(@RequestBody List<Response> responses) {
        return questionService.getScore(responses);
    }
}
