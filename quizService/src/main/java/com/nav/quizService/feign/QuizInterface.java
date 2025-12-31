package com.nav.quizService.feign;

import com.nav.quizService.entity.QuestionWrapper;
import com.nav.quizService.entity.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("QUESTION-SERVICE")
public interface QuizInterface {

    @GetMapping("/api/questions/generate")
    ResponseEntity<List<Integer>> geteQuestionsForQuiz
            (@RequestParam String categoryName, @RequestParam Integer numberOfQuestions);

    @PostMapping("/api/questions/by-ids")
    ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(@RequestBody List<Integer> questionIds);

    @PostMapping("/api/questions/score")
    ResponseEntity<Integer> getScore(@RequestBody List<Response> responses);
}
