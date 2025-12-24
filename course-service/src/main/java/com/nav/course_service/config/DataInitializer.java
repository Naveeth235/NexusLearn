package com.nav.course_service.config;

import com.nav.course_service.entity.Chapter;
import com.nav.course_service.entity.Course;
import com.nav.course_service.entity.Lesson;
import com.nav.course_service.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(CourseRepository courseRepository) {
        return args -> {
            // Check if data already exists
            if (courseRepository.count() > 0) {
                return;
            }

            // Create Course 1: Java Programming
            Course javaCourse = Course.builder()
                    .title("Complete Java Programming Masterclass")
                    .description("Learn Java from basics to advanced concepts including OOP, Collections, Streams, and Spring Boot. Perfect for beginners and intermediate developers.")
                    .build();

            Chapter javaChapter1 = Chapter.builder()
                    .title("Introduction to Java")
                    .course(javaCourse)
                    .build();

            Chapter javaChapter2 = Chapter.builder()
                    .title("Object-Oriented Programming")
                    .course(javaCourse)
                    .build();

            Lesson javaLesson1 = Lesson.builder()
                    .title("What is Java?")
                    .content("Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.")
                    .videoUrl("https://www.youtube.com/watch?v=eIrMbAQSU34")
                    .chapter(javaChapter1)
                    .build();

            Lesson javaLesson2 = Lesson.builder()
                    .title("Installing Java JDK")
                    .content("Step-by-step guide to install Java Development Kit on Windows, Mac, and Linux. Learn how to set up your development environment.")
                    .videoUrl("https://www.youtube.com/watch?v=IJ-PJbvJBGs")
                    .chapter(javaChapter1)
                    .build();

            Lesson javaLesson3 = Lesson.builder()
                    .title("Your First Java Program")
                    .content("Write and run your first Hello World program in Java. Understand the structure of a Java program.")
                    .videoUrl("https://www.youtube.com/watch?v=example3")
                    .chapter(javaChapter1)
                    .build();

            Lesson javaLesson4 = Lesson.builder()
                    .title("Classes and Objects")
                    .content("Understanding classes and objects in Java. Learn how to create classes, instantiate objects, and use them in your programs.")
                    .videoUrl("https://www.youtube.com/watch?v=example4")
                    .chapter(javaChapter2)
                    .build();

            Lesson javaLesson5 = Lesson.builder()
                    .title("Inheritance and Polymorphism")
                    .content("Master inheritance and polymorphism concepts in Java. Learn how to create class hierarchies and achieve code reusability.")
                    .videoUrl("https://www.youtube.com/watch?v=example5")
                    .chapter(javaChapter2)
                    .build();

            javaChapter1.setLessons(Arrays.asList(javaLesson1, javaLesson2, javaLesson3));
            javaChapter2.setLessons(Arrays.asList(javaLesson4, javaLesson5));
            javaCourse.setChapters(Arrays.asList(javaChapter1, javaChapter2));

            // Create Course 2: Python Programming
            Course pythonCourse = Course.builder()
                    .title("Python for Beginners")
                    .description("Learn Python programming from scratch with hands-on projects. Cover variables, loops, functions, OOP, and popular libraries like pandas and numpy.")
                    .build();

            Chapter pythonChapter1 = Chapter.builder()
                    .title("Python Basics")
                    .course(pythonCourse)
                    .build();

            Chapter pythonChapter2 = Chapter.builder()
                    .title("Data Structures in Python")
                    .course(pythonCourse)
                    .build();

            Lesson pythonLesson1 = Lesson.builder()
                    .title("Installing Python")
                    .content("How to install Python on Windows, Mac, and Linux. Setup your Python development environment with pip and virtual environments.")
                    .videoUrl("https://www.youtube.com/watch?v=example6")
                    .chapter(pythonChapter1)
                    .build();

            Lesson pythonLesson2 = Lesson.builder()
                    .title("Variables and Data Types")
                    .content("Learn about Python variables, data types including int, float, string, boolean, and type conversion.")
                    .videoUrl("https://www.youtube.com/watch?v=example7")
                    .chapter(pythonChapter1)
                    .build();

            Lesson pythonLesson3 = Lesson.builder()
                    .title("Lists and Tuples")
                    .content("Master Python lists and tuples. Learn list operations, slicing, and common list methods.")
                    .videoUrl("https://www.youtube.com/watch?v=example8")
                    .chapter(pythonChapter2)
                    .build();

            pythonChapter1.setLessons(Arrays.asList(pythonLesson1, pythonLesson2));
            pythonChapter2.setLessons(Arrays.asList(pythonLesson3));
            pythonCourse.setChapters(Arrays.asList(pythonChapter1, pythonChapter2));

            // Create Course 3: Web Development
            Course webCourse = Course.builder()
                    .title("Full Stack Web Development Bootcamp")
                    .description("Build modern web applications with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Includes 5 real-world projects.")
                    .build();

            Chapter webChapter1 = Chapter.builder()
                    .title("HTML & CSS Fundamentals")
                    .course(webCourse)
                    .build();

            Chapter webChapter2 = Chapter.builder()
                    .title("JavaScript Essentials")
                    .course(webCourse)
                    .build();

            Chapter webChapter3 = Chapter.builder()
                    .title("React Framework")
                    .course(webCourse)
                    .build();

            Lesson webLesson1 = Lesson.builder()
                    .title("HTML Basics")
                    .content("Learn HTML structure, tags, semantic HTML, forms, and best practices for modern web development.")
                    .videoUrl("https://www.youtube.com/watch?v=example9")
                    .chapter(webChapter1)
                    .build();

            Lesson webLesson2 = Lesson.builder()
                    .title("CSS Styling")
                    .content("Master CSS selectors, box model, flexbox, grid, and responsive design principles.")
                    .videoUrl("https://www.youtube.com/watch?v=example10")
                    .chapter(webChapter1)
                    .build();

            Lesson webLesson3 = Lesson.builder()
                    .title("JavaScript Basics")
                    .content("Learn JavaScript fundamentals including variables, functions, arrays, objects, and ES6+ features.")
                    .videoUrl("https://www.youtube.com/watch?v=example11")
                    .chapter(webChapter2)
                    .build();

            Lesson webLesson4 = Lesson.builder()
                    .title("Introduction to React")
                    .content("Get started with React. Learn about components, JSX, props, and state management.")
                    .videoUrl("https://www.youtube.com/watch?v=example12")
                    .chapter(webChapter3)
                    .build();

            webChapter1.setLessons(Arrays.asList(webLesson1, webLesson2));
            webChapter2.setLessons(Arrays.asList(webLesson3));
            webChapter3.setLessons(Arrays.asList(webLesson4));
            webCourse.setChapters(Arrays.asList(webChapter1, webChapter2, webChapter3));

            // Create Course 4: Data Science with Python
            Course dataScience = Course.builder()
                    .title("Data Science Fundamentals")
                    .description("Master data science with Python, pandas, numpy, matplotlib, and machine learning basics. Includes real-world data analysis projects.")
                    .build();

            Chapter dsChapter1 = Chapter.builder()
                    .title("Introduction to Data Science")
                    .course(dataScience)
                    .build();

            Lesson dsLesson1 = Lesson.builder()
                    .title("What is Data Science?")
                    .content("Overview of data science, its applications, and the data science workflow. Learn about the tools and technologies used in the field.")
                    .videoUrl("https://www.youtube.com/watch?v=example13")
                    .chapter(dsChapter1)
                    .build();

            Lesson dsLesson2 = Lesson.builder()
                    .title("Python for Data Science")
                    .content("Setup Python environment for data science. Introduction to Jupyter notebooks and essential libraries.")
                    .videoUrl("https://www.youtube.com/watch?v=example14")
                    .chapter(dsChapter1)
                    .build();

            dsChapter1.setLessons(Arrays.asList(dsLesson1, dsLesson2));
            dataScience.setChapters(Arrays.asList(dsChapter1));

            // Create Course 5: Spring Boot Microservices
            Course springCourse = Course.builder()
                    .title("Spring Boot Microservices Architecture")
                    .description("Build production-ready microservices with Spring Boot, Spring Cloud, Docker, and Kubernetes. Learn service discovery, API Gateway, and more.")
                    .build();

            Chapter springChapter1 = Chapter.builder()
                    .title("Getting Started with Spring Boot")
                    .course(springCourse)
                    .build();

            Lesson springLesson1 = Lesson.builder()
                    .title("Introduction to Spring Boot")
                    .content("Overview of Spring Boot framework, auto-configuration, and building your first REST API.")
                    .videoUrl("https://www.youtube.com/watch?v=example15")
                    .chapter(springChapter1)
                    .build();

            springChapter1.setLessons(Arrays.asList(springLesson1));
            springCourse.setChapters(Arrays.asList(springChapter1));

            // Save all courses
            courseRepository.saveAll(Arrays.asList(javaCourse, pythonCourse, webCourse, dataScience, springCourse));

            System.out.println("Sample data initialized successfully!");
        };
    }
}
