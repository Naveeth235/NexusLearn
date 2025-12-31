package com.nav.course_service.controller;

import com.nav.course_service.entity.Enrollment;
import com.nav.course_service.entity.EnrollmentStatus;
import com.nav.course_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourseId(courseId));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @RequestParam String studentId, 
            @RequestParam Long courseId) {
        boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
        return ResponseEntity.ok(Map.of("enrolled", isEnrolled));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<Enrollment> getEnrollmentByStudentAndCourse(
            @PathVariable String studentId,
            @PathVariable Long courseId) {
        return enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStatus(@PathVariable EnrollmentStatus status) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Enrollment> enrollStudent(@RequestParam String studentId, @RequestParam Long courseId) {
        try {
            Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Enrollment> updateEnrollmentStatus(@PathVariable Long id, @RequestParam EnrollmentStatus status) {
        try {
            Enrollment updatedEnrollment = enrollmentService.updateEnrollmentStatus(id, status);
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Enrollment> updateProgress(
            @PathVariable Long id,
            @RequestParam Integer progress,
            @RequestParam(required = false, defaultValue = "0") Integer completedLessons) {
        try {
            Enrollment updatedEnrollment = enrollmentService.updateProgress(id, progress, completedLessons);
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/student/{studentId}/course/{courseId}/progress")
    public ResponseEntity<Enrollment> updateProgressByStudentAndCourse(
            @PathVariable String studentId,
            @PathVariable Long courseId,
            @RequestParam Integer progress,
            @RequestParam(required = false, defaultValue = "0") Integer completedLessons) {
        try {
            Enrollment updatedEnrollment = enrollmentService.updateProgressByStudentAndCourse(
                    studentId, courseId, progress, completedLessons);
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
