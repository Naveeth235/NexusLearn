import { useState, useEffect } from 'react';
import { courseService, enrollmentService } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export interface Course {
  enrolledStudents: number;
  imageUrl: string;
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  duration?: string;
  instructor?: string;
  level?: string;
  rating?: number;
  students?: number;
  chapters?: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  type: 'VIDEO' | 'READING' | 'QUIZ';
}

export interface Enrollment {
  id: number;
  studentId: string;
  course: Course;
  enrolledAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  progress: number;
  lastAccessedAt?: string;
  completedLessons: number;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses() as Course[];
      setCourses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = async (courseId: string) => {
    try {
      const data = await courseService.getCourseById(courseId);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course');
      throw err;
    }
  };

  const enrollCourse = async (courseId: string, studentId: string) => {
    try {
      await enrollmentService.enrollStudent(studentId, courseId);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to enroll in course');
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById,
    enrollCourse,
  };
}

export function useEnrolledCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await enrollmentService.getStudentEnrollments(user.id.toString()) as Enrollment[];
      setEnrolledCourses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enrolled courses');
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (enrollmentId: number, progress: number, completedLessons: number) => {
    try {
      const updated = await enrollmentService.updateProgress(
        enrollmentId.toString(),
        progress,
        completedLessons
      ) as Enrollment;
      setEnrolledCourses(prev => 
        prev.map(e => e.id === enrollmentId ? updated : e)
      );
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update progress');
      throw err;
    }
  };

  const unenroll = async (enrollmentId: number) => {
    try {
      await enrollmentService.deleteEnrollment(enrollmentId.toString());
      setEnrolledCourses(prev => prev.filter(e => e.id !== enrollmentId));
    } catch (err: any) {
      setError(err.message || 'Failed to unenroll from course');
      throw err;
    }
  };

  return {
    enrolledCourses,
    loading,
    error,
    fetchEnrolledCourses,
    updateProgress,
    unenroll,
  };
}
