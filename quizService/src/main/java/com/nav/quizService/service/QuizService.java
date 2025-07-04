package com.nav.quizService.service;

import com.nav.quizService.entity.QuestionWrapper;
import com.nav.quizService.entity.Quiz;
import com.nav.quizService.entity.Response;
import com.nav.quizService.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

//    @Autowired
//    private QuestionRepository questionRepository;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
//        List<Question> questions = questionRepository.findRandomQuestionsByCategory(category, numQ);
//
//        Quiz quiz = new Quiz();
//        quiz.setTitle(title);
//        quiz.setQuestions(questions);
//
//        quizRepository.save(quiz);

        return new ResponseEntity<>("Quiz created successfully", HttpStatus.CREATED);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        Optional<Quiz> quiz = quizRepository.findById(id);
        if (quiz.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

//        List<Question> questions = quiz.get().getQuestions();
        List<QuestionWrapper> wrappedQuestions = new ArrayList<>();
//
//        for (Question q : questions) {
//            QuestionWrapper qw = new QuestionWrapper(
//                    q.getId(),
//                    q.getQuestionTitle(),
//                    q.getOption1(),
//                    q.getOption2(),
//                    q.getOption3(),
//                    q.getOption4()
//            );
//            wrappedQuestions.add(qw);
//        }

        return new ResponseEntity<>(wrappedQuestions, HttpStatus.OK);
    }

    public Integer calculateResult(Integer id, List<Response> responses) {
//        Quiz quiz = quizRepository.findById(id).get();
//        List<Question> questions = quiz.getQuestions();
//
        int right = 0;
//        int i = 0;
//
//        for (Response response : responses) {
//            if (response.getResponse().equals(questions.get(i).getRightAnswer())) {
//                right++;
//            }
//            i++;
//        }

        return right;
    }
}
