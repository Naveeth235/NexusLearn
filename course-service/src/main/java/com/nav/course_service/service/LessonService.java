package com.nav.course_service.service;

import com.nav.course_service.entity.Chapter;
import com.nav.course_service.entity.Lesson;
import com.nav.course_service.repository.ChapterRepository;
import com.nav.course_service.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ChapterRepository chapterRepository;

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    public Lesson createLesson(Long chapterId, Lesson lesson) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found with id: " + chapterId));
        
        lesson.setChapter(chapter);
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson lessonDetails) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        
        lesson.setTitle(lessonDetails.getTitle());
        lesson.setContent(lessonDetails.getContent());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}
