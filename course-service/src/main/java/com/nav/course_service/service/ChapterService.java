package com.nav.course_service.service;

import com.nav.course_service.entity.Chapter;
import com.nav.course_service.entity.Course;
import com.nav.course_service.repository.ChapterRepository;
import com.nav.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Optional<Chapter> getChapterById(Long id) {
        return chapterRepository.findById(id);
    }

    public Chapter createChapter(Long courseId, Chapter chapter) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(Long id, Chapter chapterDetails) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chapter not found with id: " + id));
        
        chapter.setTitle(chapterDetails.getTitle());
        
        return chapterRepository.save(chapter);
    }

    public void deleteChapter(Long id) {
        chapterRepository.deleteById(id);
    }
}
