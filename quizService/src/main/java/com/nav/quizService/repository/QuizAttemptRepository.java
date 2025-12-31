package com.nav.quizService.repository;

import com.nav.quizService.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentIdOrderByAttemptedAtDesc(String studentId);
    List<QuizAttempt> findByQuizIdOrderByAttemptedAtDesc(Integer quizId);
    List<QuizAttempt> findByStudentIdAndQuizIdOrderByAttemptedAtDesc(String studentId, Integer quizId);
    
    @Transactional
    void deleteByQuizId(Integer quizId);
}
