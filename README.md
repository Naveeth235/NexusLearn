# NexusLearn – Interactive Learning Platform

A modern full-stack educational platform built with microservices architecture, enabling students to access interactive course materials, complete quizzes with real-time feedback, and manage their learning journey through role-based dashboards.

---

## 📸 Screenshots

### Student Dashboard
<div align="center">
  <img src="./frontend/src/assets/Student Dashboard.png" alt="Student Dashboard" width="600">
  <p><em>Student learning interface with course progress and achievements</em></p>
</div>

### My Courses
<div align="center">
  <img src="./frontend/src/assets/My Courses.png" alt="My Courses" width="600">
  <p><em>View enrolled courses and track learning progress</em></p>
</div>

### All Courses
<div align="center">
  <img src="./frontend/src/assets/All Courses.png" alt="All Courses" width="600">
  <p><em>Browse available courses and enroll in new learning paths</em></p>
</div>

### Course Information
<div align="center">
  <img src="./frontend/src/assets/Course Info.png" alt="Course Information" width="600">
  <p><em>Detailed course information with chapters and lessons</em></p>
</div>

### Course Learning Page
<div align="center">
  <img src="./frontend/src/assets/Course Learning Page.png" alt="Course Learning Page" width="600">
  <p><em>Interactive lessons with video and text content</em></p>
</div>

### Quiz Attempt
<div align="center">
  <img src="./frontend/src/assets/Quiz Attempt.png" alt="Quiz Attempt" width="600">
  <p><em>Real-time quiz with randomized questions and timer</em></p>
</div>

---

## ✨ Key Features

### For Students
- 🎓 **Interactive Learning** – Access video and text lessons organized by chapters
- ✅ **Dynamic Quizzes** – Randomized questions with instant results and scoring
- 📊 **Progress Tracking** – Monitor course completion and quiz performance
- 🎯 **Achievement System** – Earn badges and track learning milestones
- 📝 **Course Enrollment** – Browse and request access to available courses

### For Administrators
- 👥 **User Management** – Manage student accounts and roles
- 📚 **Course Management** – Create, edit, and organize courses with chapters
- ✔️ **Enrollment Approval** – Review and approve student course access requests
- 📊 **Analytics Dashboard** – Monitor platform usage and student performance
- 🛒 **Marketplace Management** – Oversee seller listings and area-based products

### Technical Features
- 🔐 **Secure Authentication** – Role-based access control (Admin/Student)
- 🏗️ **Microservices Architecture** – Independent, scalable services
- 🔄 **Service Discovery** – Eureka server for dynamic service registration
- 🌐 **API Gateway** – Centralized routing and request management
- 💬 **Inter-Service Communication** – OpenFeign for seamless microservice integration

---

## 🛠️ Technology Stack

### Backend
- **Java 17** with Spring Boot
- **Spring Cloud** (Eureka, OpenFeign)
- **PostgreSQL** for data persistence
- **Maven** for dependency management

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Modern CSS** for responsive design

### Architecture
- **Microservices** pattern
- **Service Registry** (Eureka)
- **API Gateway** for routing
- **RESTful APIs** for communication

---

## 📂 Microservices Overview

| Service | Port | Description |
|---------|------|-------------|
| **service-registry** | 8761 | Eureka server for service discovery |
| **api-gateway** | 8080 | Routes requests to appropriate microservices |
| **user-management-service** | 8081 | Handles authentication, authorization, and user profiles |
| **course-service** | 8082 | Manages courses, chapters, lessons, and enrollments |
| **quiz-service** | 8083 | Handles quiz creation and student quiz attempts |
| **question-service** | 8084 | Manages question bank and randomization |
| **frontend** | 5173 | React application for user interface |

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- PostgreSQL 14+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NexusLearn.git
   cd NexusLearn
   ```

2. **Start Service Registry (Eureka)**
   ```bash
   cd service-registry
   mvn spring-boot:run
   ```

3. **Start Backend Services** (in separate terminals)
   ```bash
   # API Gateway
   cd api-gateway && mvn spring-boot:run
   
   # User Management Service
   cd user-management-service && mvn spring-boot:run
   
   # Course Service
   cd course-service && mvn spring-boot:run
   
   # Quiz & Question Services
   cd quiz-service && mvn spring-boot:run
   cd question-service && mvn spring-boot:run
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Eureka Dashboard: `http://localhost:8761`
   - API Gateway: `http://localhost:8080`

---

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ (React)
│  Port: 5173 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Gateway │
│  Port: 8080 │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│      Service Registry (Eureka)       │
│           Port: 8761                 │
└──────────────────────────────────────┘
       │
       ├──────┬──────────┬──────────┬──────────┐
       ▼      ▼          ▼          ▼          ▼
    User   Course    Quiz    Question    [Future]
   Service Service  Service  Service     Services
```

---

## 📋 API Documentation

Key API endpoints are exposed through the API Gateway at `http://localhost:8080`

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Courses**: `/api/courses/*`
- **Quizzes**: `/api/quizzes/*`
- **Questions**: `/api/questions/*`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

