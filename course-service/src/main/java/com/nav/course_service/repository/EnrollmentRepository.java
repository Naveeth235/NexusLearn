package com.nav.course_service.repository;

import com.nav.course_service.entity.Enrollment;
import com.nav.course_service.entity.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(String studentId);
    List<Enrollment> findByStatus(EnrollmentStatus status);
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, Long courseId);
}
