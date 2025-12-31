package com.nav.quizService.service;

import com.nav.quizService.entity.QuestionWrapper;
import com.nav.quizService.entity.Quiz;
import com.nav.quizService.entity.QuizAttempt;
import com.nav.quizService.entity.QuizDTO;
import com.nav.quizService.entity.Response;
import com.nav.quizService.feign.QuizInterface;
import com.nav.quizService.repository.QuizAttemptRepository;
import com.nav.quizService.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    QuizInterface quizInterface;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        List<Integer> questions = quizInterface.geteQuestionsForQuiz(category, numQ).getBody();
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setCategory(category);
        quiz.setQuestionIds(questions);
        quiz.setPassingScore(70); // default
        quizRepository.save(quiz);

        return new ResponseEntity<>("Quiz created successfully", HttpStatus.CREATED);
    }

    public ResponseEntity<?> createQuizWithDetails(QuizDTO quizDTO) {
        try {
            Quiz quiz = new Quiz();
            quiz.setTitle(quizDTO.getTitle());
            quiz.setDescription(quizDTO.getDescription());
            quiz.setCategory(quizDTO.getCategory() != null ? quizDTO.getCategory() : quizDTO.getCategoryName());
            quiz.setDifficultyLevel(quizDTO.getDifficultyLevel());
            quiz.setTimeLimit(quizDTO.getTimeLimit());
            quiz.setPassingScore(quizDTO.getPassingScore());
            quiz.setQuestionIds(quizDTO.getQuestionIds());
            
            Quiz savedQuiz = quizRepository.save(quiz);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedQuiz);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        Quiz quiz = quizRepository.findById(id).get();
        List<Integer> questionIds = quiz.getQuestionIds();
        ResponseEntity<List<QuestionWrapper>> questions = quizInterface.getQuestionsFromId(questionIds);
        return questions;
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        ResponseEntity<Integer> score = quizInterface.getScore(responses);
        return score;
    }

    public ResponseEntity<QuizAttempt> submitQuiz(Integer quizId, String studentId, List<Response> responses, Integer timeTaken) {
        try {
            // Get the quiz
            Quiz quiz = quizRepository.findById(quizId)
                    .orElseThrow(() -> new RuntimeException("Quiz not found"));

            // Calculate score
            ResponseEntity<Integer> scoreResponse = quizInterface.getScore(responses);
            Integer correctAnswers = scoreResponse.getBody();
            
            Integer totalQuestions = quiz.getQuestionIds().size();
            Integer scorePercentage = (correctAnswers * 100) / totalQuestions;

            // Create user responses with correct/incorrect info
            List<QuizAttempt.UserResponse> userResponses = new ArrayList<>();
            for (Response response : responses) {
                QuizAttempt.UserResponse userResponse = new QuizAttempt.UserResponse();
                userResponse.setQuestionId(response.getId());
                userResponse.setSelectedAnswer(response.getResponse());
                // Note: We would need to fetch the actual question to check if correct
                // For now, we'll determine this from the score calculation
                userResponses.add(userResponse);
            }

            // Create quiz attempt record
            QuizAttempt attempt = new QuizAttempt();
            attempt.setQuizId(quizId);
            attempt.setStudentId(studentId);
            attempt.setScore(scorePercentage);
            attempt.setCorrectAnswers(correctAnswers);
            attempt.setTotalQuestions(totalQuestions);
            attempt.setUserResponses(userResponses);
            attempt.setAttemptedAt(LocalDateTime.now());
            attempt.setTimeTaken(timeTaken);

            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

            return ResponseEntity.ok(savedAttempt);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return ResponseEntity.ok(quizzes);
    }

    public ResponseEntity<Quiz> getQuizById(Integer id) {
        Optional<Quiz> quiz = quizRepository.findById(id);
        return quiz.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<QuizAttempt>> getQuizHistory(String studentId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentIdOrderByAttemptedAtDesc(studentId);
        return ResponseEntity.ok(attempts);
    }

    public ResponseEntity<QuizAttempt> getQuizAttemptById(Long attemptId) {
        Optional<QuizAttempt> attempt = quizAttemptRepository.findById(attemptId);
        return attempt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<QuizAttempt>> getQuizAttemptsByQuiz(Integer quizId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdOrderByAttemptedAtDesc(quizId);
        return ResponseEntity.ok(attempts);
    }

    public ResponseEntity<String> deleteQuiz(Integer id) {
        try {
            Optional<Quiz> quiz = quizRepository.findById(id);
            if (quiz.isEmpty()) {
                return new ResponseEntity<>("Quiz not found", HttpStatus.NOT_FOUND);
            }
            
            // Delete all quiz attempts associated with this quiz
            quizAttemptRepository.deleteByQuizId(id);
            
            // Delete the quiz
            quizRepository.deleteById(id);
            
            return new ResponseEntity<>("Quiz deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete quiz: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
