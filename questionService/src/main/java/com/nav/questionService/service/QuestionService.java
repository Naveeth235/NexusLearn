package com.nav.questionService.service;

import com.nav.questionService.entity.Question;
import com.nav.questionService.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Optional<Question> getQuestionById(Integer id) {
        return questionRepository.findById(id);
    }

    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Integer id, Question updatedQuestion) {
        return questionRepository.findById(id).map(existing -> {
            existing.setQuestionTitle(updatedQuestion.getQuestionTitle());
            existing.setOption1(updatedQuestion.getOption1());
            existing.setOption2(updatedQuestion.getOption2());
            existing.setOption3(updatedQuestion.getOption3());
            existing.setOption4(updatedQuestion.getOption4());
            existing.setRightAnswer(updatedQuestion.getRightAnswer());
            existing.setDifficultyLevel(updatedQuestion.getDifficultyLevel());
            existing.setCategory(updatedQuestion.getCategory());
            return questionRepository.save(existing);
        }).orElse(null);
    }

    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }
}
