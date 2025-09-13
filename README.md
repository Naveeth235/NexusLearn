# NexusLearn – An Interactive Learning Platform

**Description:**
A full-stack educational platform built with microservices architecture for students to access course materials and learn interactively while attempting quizzes. Features randomized questions, real-time results, and role-based access for **Admin** and **Student** users.

---

## 🚀 Features

* **User Management** – Secure registration, login, and role-based dashboards (Admin/Student).
* **Interactive Learning** – Access text and video lessons organized into chapters.
* **Quizzes & Assessments** – Randomized questions with real-time results.
* **Admin Enrollment Approval** – Students can enroll in courses, but only admins can approve access.
* **Marketplace Extension** – Sellers can list educational products, with **area-based product listings** for buyer convenience.
* **Microservices Architecture** – Independent services with service discovery and inter-service communication via **Eureka** and **Feign**.

---

## 🛠️ Tech Stack

* **Backend**: Java Spring Boot, Microservices, Eureka, Feign
* **Frontend**: React, HTML, CSS
* **Database**: PostgreSQL
* **Architecture**: Microservices with API Gateway and service registry

---

## 📂 Project Structure

```bash
NexusLearn/
├── user-service/        # Handles registration, login, and role management
├── course-service/      # Manages courses, lessons, and enrollment approvals
├── quiz-service/        # Manages quizzes, randomized questions, and results
├── marketplace-service/ # Area-based product and seller listings
├── api-gateway/         # Routes and secures API requests
├── frontend/            # React-based UI for learners and admins
└── docs/                # Documentation and design references
```

---

## ⚡ Getting Started

### Prerequisites

* **Java 17+**
* **Maven**
* **Node.js + npm/yarn**
* **PostgreSQL**

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/NexusLearn.git
   cd NexusLearn
   ```

2. **Start backend services**

   ```bash
   cd user-service
   mvn spring-boot:run
   # repeat for course-service, quiz-service, marketplace-service, etc.
   ```

3. **Start frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

This project is licensed under the MIT License.

