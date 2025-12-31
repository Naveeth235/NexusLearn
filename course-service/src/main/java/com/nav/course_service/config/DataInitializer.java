package com.nav.course_service.config;

import com.nav.course_service.entity.*;
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

            // Create Course 1: Mastering Data Structure
            Course dataCourse = Course.builder()
                    .title("Mastering Data Structure: Speed Up Coding Skills")
                    .description("This comprehensive course covers all essential data structures including arrays, linked lists, stacks, queues, trees, graphs, and hash tables. You'll learn about time and space complexity. Perfect for aspiring software engineers and developers looking to improve their problem-solving skills.")
                    .category("Data Structure")
                    .instructor("Dr. Sarah Chen")
                    .rating(4.8)
                    .duration("27h")
                    .level("Intermediate")
                    .enrolledStudents(200)
                    .imageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop")
                    .prerequisites("Basic programming knowledge,Understanding of arrays and loops")
                    .build();

            Chapter dataChapter1 = Chapter.builder()
                    .title("Introduction to Data Structures")
                    .duration("4h 30min")
                    .course(dataCourse)
                    .build();

            Chapter dataChapter2 = Chapter.builder()
                    .title("Arrays and Linked Lists")
                    .duration("3h 45min")
                    .course(dataCourse)
                    .build();

            Chapter dataChapter3 = Chapter.builder()
                    .title("Stacks and Queues")
                    .duration("2h 30min")
                    .course(dataCourse)
                    .build();

            Lesson dataLesson1 = Lesson.builder()
                    .title("What are Data Structures?")
                    .content("Data structures are specialized formats for organizing, processing, retrieving and storing data. Learn why they are essential for efficient programming.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("25min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter1)
                    .build();

            Lesson dataLesson2 = Lesson.builder()
                    .title("What are Data Structures?")
                    .content("Deep dive into algorithm complexity analysis, Big O notation, and how to evaluate the efficiency of your code.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter1)
                    .build();

            Lesson dataLesson3 = Lesson.builder()
                    .title("Using and Data Structures")
                    .content("Learn how to choose the right data structure for your specific problem and understand trade-offs.")
                    .duration("20min")
                    .type(LessonType.READING)
                    .chapter(dataChapter1)
                    .build();

            Lesson dataLesson4 = Lesson.builder()
                    .title("Array Operations")
                    .content("Master array traversal, insertion, deletion, and searching operations with time complexity analysis.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter2)
                    .build();

            Lesson dataLesson5 = Lesson.builder()
                    .title("Linked Lists")
                    .content("Understand singly and doubly linked lists, their advantages over arrays, and common operations.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter2)
                    .build();

            Lesson dataLesson6 = Lesson.builder()
                    .title("Practice Problems")
                    .content("Test your knowledge with hands-on exercises covering arrays and linked lists.")
                    .duration("20min")
                    .type(LessonType.QUIZ)
                    .chapter(dataChapter2)
                    .build();

            Lesson dataLesson7 = Lesson.builder()
                    .title("Stack Implementation")
                    .content("Learn stack data structure, LIFO principle, and implement push, pop, and peek operations.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter3)
                    .build();

            Lesson dataLesson8 = Lesson.builder()
                    .title("Queue Implementation")
                    .content("Understand queue data structure, FIFO principle, and various types of queues.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(dataChapter3)
                    .build();

            Lesson dataLesson9 = Lesson.builder()
                    .title("Real-world Applications")
                    .content("Explore practical applications of stacks and queues in software development.")
                    .duration("15min")
                    .type(LessonType.READING)
                    .chapter(dataChapter3)
                    .build();

            dataChapter1.setLessons(Arrays.asList(dataLesson1, dataLesson2, dataLesson3));
            dataChapter2.setLessons(Arrays.asList(dataLesson4, dataLesson5, dataLesson6));
            dataChapter3.setLessons(Arrays.asList(dataLesson7, dataLesson8, dataLesson9));
            dataCourse.setChapters(Arrays.asList(dataChapter1, dataChapter2, dataChapter3));

            // Create Course 2: Cloud Computing
            Course cloudCourse = Course.builder()
                    .title("Information and Cloud Computing: Future of IT")
                    .description("Explore cloud computing technologies and their impact on modern IT infrastructure. Learn AWS, Azure, Google Cloud, containerization with Docker, and orchestration with Kubernetes.")
                    .category("Cloud Computing")
                    .instructor("Prof. Michael Johnson")
                    .rating(4.6)
                    .duration("22h")
                    .level("Intermediate")
                    .enrolledStudents(180)
                    .imageUrl("https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop")
                    .prerequisites("Basic understanding of networking,Familiarity with Linux commands")
                    .build();

            Chapter cloudChapter1 = Chapter.builder()
                    .title("Introduction to Cloud Computing")
                    .duration("3h 20min")
                    .course(cloudCourse)
                    .build();

            Chapter cloudChapter2 = Chapter.builder()
                    .title("Cloud Service Models")
                    .duration("4h 15min")
                    .course(cloudCourse)
                    .build();

            Lesson cloudLesson1 = Lesson.builder()
                    .title("What is Cloud Computing?")
                    .content("Understanding cloud computing fundamentals, benefits, and deployment models (IaaS, PaaS, SaaS).")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("25min")
                    .type(LessonType.VIDEO)
                    .chapter(cloudChapter1)
                    .build();

            Lesson cloudLesson2 = Lesson.builder()
                    .title("Cloud Providers Overview")
                    .content("Compare major cloud providers: AWS, Azure, and Google Cloud Platform.")
                    .duration("20min")
                    .type(LessonType.READING)
                    .chapter(cloudChapter1)
                    .build();

            Lesson cloudLesson3 = Lesson.builder()
                    .title("IaaS, PaaS, and SaaS")
                    .content("Deep dive into Infrastructure, Platform, and Software as a Service models.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(cloudChapter2)
                    .build();

            cloudChapter1.setLessons(Arrays.asList(cloudLesson1, cloudLesson2));
            cloudChapter2.setLessons(Arrays.asList(cloudLesson3));
            cloudCourse.setChapters(Arrays.asList(cloudChapter1, cloudChapter2));

            // Create Course 3: Cyber Security
            Course securityCourse = Course.builder()
                    .title("Keeping Data Safe: Cyber Attacks Defense Strategy")
                    .description("Master cybersecurity fundamentals and protect systems from modern threats. Learn about network security, cryptography, ethical hacking, and security best practices.")
                    .category("Cyber Security")
                    .instructor("Dr. Emily Rodriguez")
                    .rating(4.9)
                    .duration("30h")
                    .level("Advanced")
                    .enrolledStudents(250)
                    .imageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop")
                    .prerequisites("Networking fundamentals,Basic programming skills")
                    .build();

            Chapter secChapter1 = Chapter.builder()
                    .title("Introduction to Cybersecurity")
                    .duration("5h 00min")
                    .course(securityCourse)
                    .build();

            Chapter secChapter2 = Chapter.builder()
                    .title("Network Security")
                    .duration("6h 30min")
                    .course(securityCourse)
                    .build();

            Lesson secLesson1 = Lesson.builder()
                    .title("Cybersecurity Fundamentals")
                    .content("Learn the CIA triad: Confidentiality, Integrity, and Availability. Understand common attack vectors.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(secChapter1)
                    .build();

            Lesson secLesson2 = Lesson.builder()
                    .title("Threat Landscape")
                    .content("Explore modern cyber threats including malware, ransomware, phishing, and social engineering.")
                    .duration("25min")
                    .type(LessonType.READING)
                    .chapter(secChapter1)
                    .build();

            Lesson secLesson3 = Lesson.builder()
                    .title("Firewalls and VPNs")
                    .content("Understanding network security tools: firewalls, VPNs, and intrusion detection systems.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(secChapter2)
                    .build();

            secChapter1.setLessons(Arrays.asList(secLesson1, secLesson2));
            secChapter2.setLessons(Arrays.asList(secLesson3));
            securityCourse.setChapters(Arrays.asList(secChapter1, secChapter2));

            // Create Course 4: Web Development
            Course webCourse = Course.builder()
                    .title("Full Stack Web Development Bootcamp")
                    .description("Build modern web applications with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Includes 5 real-world projects and deployment strategies.")
                    .category("Web Development")
                    .instructor("Alex Thompson")
                    .rating(4.7)
                    .duration("35h")
                    .level("Beginner")
                    .enrolledStudents(320)
                    .imageUrl("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=450&fit=crop")
                    .prerequisites("No prior experience required")
                    .build();

            Chapter webChapter1 = Chapter.builder()
                    .title("HTML & CSS Fundamentals")
                    .duration("5h 00min")
                    .course(webCourse)
                    .build();

            Chapter webChapter2 = Chapter.builder()
                    .title("JavaScript Essentials")
                    .duration("6h 30min")
                    .course(webCourse)
                    .build();

            Chapter webChapter3 = Chapter.builder()
                    .title("React Framework")
                    .duration("7h 00min")
                    .course(webCourse)
                    .build();

            Lesson webLesson1 = Lesson.builder()
                    .title("HTML Basics")
                    .content("Learn HTML structure, tags, semantic HTML, forms, and best practices for modern web development.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(webChapter1)
                    .build();

            Lesson webLesson2 = Lesson.builder()
                    .title("CSS Styling")
                    .content("Master CSS selectors, box model, flexbox, grid, and responsive design principles.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(webChapter1)
                    .build();

            Lesson webLesson3 = Lesson.builder()
                    .title("JavaScript Basics")
                    .content("Learn JavaScript fundamentals including variables, functions, arrays, objects, and ES6+ features.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("45min")
                    .type(LessonType.VIDEO)
                    .chapter(webChapter2)
                    .build();

            Lesson webLesson4 = Lesson.builder()
                    .title("Introduction to React")
                    .content("Get started with React. Learn about components, JSX, props, and state management.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("50min")
                    .type(LessonType.VIDEO)
                    .chapter(webChapter3)
                    .build();

            webChapter1.setLessons(Arrays.asList(webLesson1, webLesson2));
            webChapter2.setLessons(Arrays.asList(webLesson3));
            webChapter3.setLessons(Arrays.asList(webLesson4));
            webCourse.setChapters(Arrays.asList(webChapter1, webChapter2, webChapter3));

            // Create Course 5: Machine Learning
            Course mlCourse = Course.builder()
                    .title("Machine Learning and AI Fundamentals")
                    .description("Dive into machine learning algorithms, neural networks, and AI applications. Learn Python, TensorFlow, scikit-learn, and build real ML models.")
                    .category("Machine Learning")
                    .instructor("Dr. James Wilson")
                    .rating(4.8)
                    .duration("40h")
                    .level("Advanced")
                    .enrolledStudents(190)
                    .imageUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop")
                    .prerequisites("Python programming,Statistics knowledge,Linear algebra basics")
                    .build();

            Chapter mlChapter1 = Chapter.builder()
                    .title("Introduction to Machine Learning")
                    .duration("4h 00min")
                    .course(mlCourse)
                    .build();

            Lesson mlLesson1 = Lesson.builder()
                    .title("What is Machine Learning?")
                    .content("Overview of machine learning, types of learning (supervised, unsupervised, reinforcement), and real-world applications.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(mlChapter1)
                    .build();

            Lesson mlLesson2 = Lesson.builder()
                    .title("Python for ML")
                    .content("Setup Python environment for machine learning with essential libraries: NumPy, Pandas, Matplotlib.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(mlChapter1)
                    .build();

            mlChapter1.setLessons(Arrays.asList(mlLesson1, mlLesson2));
            mlCourse.setChapters(Arrays.asList(mlChapter1));

            // Create Course 6: Mobile App Development
            Course mobileCourse = Course.builder()
                    .title("Mobile App Development with React Native")
                    .description("Build cross-platform mobile applications for iOS and Android using React Native. Learn mobile UI design, navigation, state management, and API integration.")
                    .category("Mobile Development")
                    .instructor("Sarah Martinez")
                    .rating(4.7)
                    .duration("28h")
                    .level("Intermediate")
                    .enrolledStudents(215)
                    .imageUrl("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop")
                    .prerequisites("JavaScript knowledge,React basics,Understanding of mobile platforms")
                    .build();

            Chapter mobileChapter1 = Chapter.builder()
                    .title("Getting Started with React Native")
                    .duration("4h 30min")
                    .course(mobileCourse)
                    .build();

            Chapter mobileChapter2 = Chapter.builder()
                    .title("Mobile UI Components")
                    .duration("5h 00min")
                    .course(mobileCourse)
                    .build();

            Lesson mobileLesson1 = Lesson.builder()
                    .title("React Native Setup")
                    .content("Install and configure React Native development environment. Set up Android Studio and Xcode.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(mobileChapter1)
                    .build();

            Lesson mobileLesson2 = Lesson.builder()
                    .title("Building Your First App")
                    .content("Create a simple mobile application with React Native. Understand project structure and basic components.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("45min")
                    .type(LessonType.VIDEO)
                    .chapter(mobileChapter1)
                    .build();

            Lesson mobileLesson3 = Lesson.builder()
                    .title("Core Components")
                    .content("Learn about View, Text, Image, ScrollView, and other essential React Native components.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(mobileChapter2)
                    .build();

            mobileChapter1.setLessons(Arrays.asList(mobileLesson1, mobileLesson2));
            mobileChapter2.setLessons(Arrays.asList(mobileLesson3));
            mobileCourse.setChapters(Arrays.asList(mobileChapter1, mobileChapter2));

            // Create Course 7: Database Design
            Course databaseCourse = Course.builder()
                    .title("Database Design and SQL Mastery")
                    .description("Master database design principles, SQL queries, normalization, and database optimization. Learn PostgreSQL, MySQL, and NoSQL databases like MongoDB.")
                    .category("Database")
                    .instructor("Prof. David Kumar")
                    .rating(4.8)
                    .duration("25h")
                    .level("Intermediate")
                    .enrolledStudents(280)
                    .imageUrl("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop")
                    .prerequisites("Basic programming knowledge,Understanding of data concepts")
                    .build();

            Chapter dbChapter1 = Chapter.builder()
                    .title("Database Fundamentals")
                    .duration("4h 00min")
                    .course(databaseCourse)
                    .build();

            Chapter dbChapter2 = Chapter.builder()
                    .title("Advanced SQL")
                    .duration("5h 30min")
                    .course(databaseCourse)
                    .build();

            Lesson dbLesson1 = Lesson.builder()
                    .title("Introduction to Databases")
                    .content("Understanding databases, DBMS, relational vs non-relational databases, and when to use each.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("25min")
                    .type(LessonType.VIDEO)
                    .chapter(dbChapter1)
                    .build();

            Lesson dbLesson2 = Lesson.builder()
                    .title("SQL Basics")
                    .content("Learn SELECT, INSERT, UPDATE, DELETE statements and basic query operations.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(dbChapter1)
                    .build();

            Lesson dbLesson3 = Lesson.builder()
                    .title("Joins and Subqueries")
                    .content("Master INNER JOIN, LEFT JOIN, RIGHT JOIN, and complex subqueries for data retrieval.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(dbChapter2)
                    .build();

            Lesson dbLesson4 = Lesson.builder()
                    .title("Practice Exercises")
                    .content("Test your SQL knowledge with real-world database queries and optimization challenges.")
                    .duration("30min")
                    .type(LessonType.QUIZ)
                    .chapter(dbChapter2)
                    .build();

            dbChapter1.setLessons(Arrays.asList(dbLesson1, dbLesson2));
            dbChapter2.setLessons(Arrays.asList(dbLesson3, dbLesson4));
            databaseCourse.setChapters(Arrays.asList(dbChapter1, dbChapter2));

            // Create Course 8: DevOps and CI/CD
            Course devopsCourse = Course.builder()
                    .title("DevOps Engineering: CI/CD and Cloud Infrastructure")
                    .description("Learn DevOps practices, continuous integration, continuous deployment, Docker, Kubernetes, Jenkins, and infrastructure as code with Terraform.")
                    .category("DevOps")
                    .instructor("Mark Anderson")
                    .rating(4.9)
                    .duration("32h")
                    .level("Advanced")
                    .enrolledStudents(165)
                    .imageUrl("https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop")
                    .prerequisites("Linux basics,Understanding of cloud concepts,Programming experience")
                    .build();

            Chapter devopsChapter1 = Chapter.builder()
                    .title("Introduction to DevOps")
                    .duration("3h 30min")
                    .course(devopsCourse)
                    .build();

            Chapter devopsChapter2 = Chapter.builder()
                    .title("Docker and Containers")
                    .duration("6h 00min")
                    .course(devopsCourse)
                    .build();

            Lesson devopsLesson1 = Lesson.builder()
                    .title("What is DevOps?")
                    .content("Understanding DevOps culture, practices, and the DevOps lifecycle. Learn about CI/CD pipelines.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(devopsChapter1)
                    .build();

            Lesson devopsLesson2 = Lesson.builder()
                    .title("Version Control with Git")
                    .content("Master Git workflows, branching strategies, and collaboration best practices.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(devopsChapter1)
                    .build();

            Lesson devopsLesson3 = Lesson.builder()
                    .title("Docker Fundamentals")
                    .content("Learn containerization with Docker. Create, manage, and deploy Docker containers.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("45min")
                    .type(LessonType.VIDEO)
                    .chapter(devopsChapter2)
                    .build();

            devopsChapter1.setLessons(Arrays.asList(devopsLesson1, devopsLesson2));
            devopsChapter2.setLessons(Arrays.asList(devopsLesson3));
            devopsCourse.setChapters(Arrays.asList(devopsChapter1, devopsChapter2));

            // Create Course 9: Blockchain Technology
            Course blockchainCourse = Course.builder()
                    .title("Blockchain Development and Smart Contracts")
                    .description("Dive into blockchain technology, cryptocurrency, smart contracts, Ethereum, Solidity, and decentralized applications (DApps).")
                    .category("Blockchain")
                    .instructor("Dr. Lisa Chen")
                    .rating(4.6)
                    .duration("30h")
                    .level("Advanced")
                    .enrolledStudents(145)
                    .imageUrl("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop")
                    .prerequisites("Programming experience,Cryptography basics,Understanding of distributed systems")
                    .build();

            Chapter blockchainChapter1 = Chapter.builder()
                    .title("Blockchain Fundamentals")
                    .duration("5h 00min")
                    .course(blockchainCourse)
                    .build();

            Chapter blockchainChapter2 = Chapter.builder()
                    .title("Smart Contracts with Solidity")
                    .duration("6h 30min")
                    .course(blockchainCourse)
                    .build();

            Lesson blockchainLesson1 = Lesson.builder()
                    .title("Introduction to Blockchain")
                    .content("Understanding blockchain architecture, consensus mechanisms, and cryptographic principles.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("35min")
                    .type(LessonType.VIDEO)
                    .chapter(blockchainChapter1)
                    .build();

            Lesson blockchainLesson2 = Lesson.builder()
                    .title("Cryptocurrency Basics")
                    .content("Learn about Bitcoin, Ethereum, and other cryptocurrencies. Understand wallets and transactions.")
                    .duration("25min")
                    .type(LessonType.READING)
                    .chapter(blockchainChapter1)
                    .build();

            Lesson blockchainLesson3 = Lesson.builder()
                    .title("Writing Smart Contracts")
                    .content("Create your first smart contract using Solidity. Deploy contracts to Ethereum testnet.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("50min")
                    .type(LessonType.VIDEO)
                    .chapter(blockchainChapter2)
                    .build();

            blockchainChapter1.setLessons(Arrays.asList(blockchainLesson1, blockchainLesson2));
            blockchainChapter2.setLessons(Arrays.asList(blockchainLesson3));
            blockchainCourse.setChapters(Arrays.asList(blockchainChapter1, blockchainChapter2));

            // Create Course 10: UI/UX Design
            Course uxCourse = Course.builder()
                    .title("UI/UX Design: Creating Beautiful User Experiences")
                    .description("Master user interface and user experience design. Learn design principles, wireframing, prototyping with Figma, user research, and usability testing.")
                    .category("Design")
                    .instructor("Emma Wilson")
                    .rating(4.8)
                    .duration("24h")
                    .level("Beginner")
                    .enrolledStudents(310)
                    .imageUrl("https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop")
                    .prerequisites("No prior experience required,Basic computer skills")
                    .build();

            Chapter uxChapter1 = Chapter.builder()
                    .title("Design Fundamentals")
                    .duration("4h 00min")
                    .course(uxCourse)
                    .build();

            Chapter uxChapter2 = Chapter.builder()
                    .title("Prototyping with Figma")
                    .duration("5h 30min")
                    .course(uxCourse)
                    .build();

            Chapter uxChapter3 = Chapter.builder()
                    .title("User Research and Testing")
                    .duration("3h 00min")
                    .course(uxCourse)
                    .build();

            Lesson uxLesson1 = Lesson.builder()
                    .title("Introduction to UI/UX")
                    .content("Understanding the difference between UI and UX. Learn design thinking principles.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("25min")
                    .type(LessonType.VIDEO)
                    .chapter(uxChapter1)
                    .build();

            Lesson uxLesson2 = Lesson.builder()
                    .title("Color Theory and Typography")
                    .content("Master color palettes, typography, and visual hierarchy in design.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("30min")
                    .type(LessonType.VIDEO)
                    .chapter(uxChapter1)
                    .build();

            Lesson uxLesson3 = Lesson.builder()
                    .title("Wireframing and Mockups")
                    .content("Create wireframes and high-fidelity mockups using Figma. Learn component libraries.")
                    .videoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                    .duration("40min")
                    .type(LessonType.VIDEO)
                    .chapter(uxChapter2)
                    .build();

            Lesson uxLesson4 = Lesson.builder()
                    .title("User Testing Methods")
                    .content("Learn how to conduct user interviews, surveys, and usability testing sessions.")
                    .duration("20min")
                    .type(LessonType.READING)
                    .chapter(uxChapter3)
                    .build();

            uxChapter1.setLessons(Arrays.asList(uxLesson1, uxLesson2));
            uxChapter2.setLessons(Arrays.asList(uxLesson3));
            uxChapter3.setLessons(Arrays.asList(uxLesson4));
            uxCourse.setChapters(Arrays.asList(uxChapter1, uxChapter2, uxChapter3));

            // Save all courses
            courseRepository.saveAll(Arrays.asList(dataCourse, cloudCourse, securityCourse, webCourse, mlCourse,
                    mobileCourse, databaseCourse, devopsCourse, blockchainCourse, uxCourse));

            System.out.println("Sample data initialized successfully with " + courseRepository.count() + " courses!");
        };
    }
}
