package com.nav.course_service.service;

import com.nav.course_service.entity.Course;
import com.nav.course_service.entity.Enrollment;
import com.nav.course_service.entity.EnrollmentStatus;
import com.nav.course_service.repository.CourseRepository;
import com.nav.course_service.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollment> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    public List<Enrollment> getEnrollmentsByStudentId(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    public Optional<Enrollment> getEnrollmentByStudentAndCourse(String studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    public boolean isStudentEnrolled(String studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).isPresent();
    }

    public Enrollment enrollStudent(String studentId, Long courseId) {
        // Check if already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (existingEnrollment.isPresent()) {
            return existingEnrollment.get(); // Return existing enrollment instead of creating duplicate
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        Enrollment enrollment = Enrollment.builder()
                .studentId(studentId)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .status(EnrollmentStatus.PENDING)
                .progress(0)
                .completedLessons(0)
                .lastAccessedAt(LocalDateTime.now())
                .build();
        
        // Increment enrolled students count
        if (course.getEnrolledStudents() != null) {
            course.setEnrolledStudents(course.getEnrolledStudents() + 1);
        } else {
            course.setEnrolledStudents(1);
        }
        courseRepository.save(course);
        
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateEnrollmentStatus(Long id, EnrollmentStatus status) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        
        enrollment.setStatus(status);
        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        
        return updatedEnrollment;
    }

    public Enrollment updateProgress(Long enrollmentId, Integer progress, Integer completedLessons) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        
        enrollment.setProgress(Math.min(100, Math.max(0, progress))); // Ensure progress is between 0-100
        enrollment.setCompletedLessons(completedLessons);
        enrollment.setLastAccessedAt(LocalDateTime.now());
        
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateProgressByStudentAndCourse(String studentId, Long courseId, Integer progress, Integer completedLessons) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        enrollment.setProgress(Math.min(100, Math.max(0, progress)));
        enrollment.setCompletedLessons(completedLessons);
        enrollment.setLastAccessedAt(LocalDateTime.now());
        
        return enrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }

    public List<Enrollment> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status);
    }
}
