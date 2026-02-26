# SMART Campus - Resource Management System

A full-stack application for managing campus facilities and assets, developed for the Programming Applications and Frameworks (IT3030) Assignment.

## Project Structure
- `/PAF`: Spring Boot Backend (Java 25, Spring Boot 4.0.3)
- `/frontend`: React Frontend (Material UI, Axios)

## Prerequisites
- **Java**: JDK 25.0.2 or higher
- **Node.js**: v18 or higher
- **MySQL**: 8.0.x (Running on port 3308)

## Getting Started

### 1. Database Setup
Ensure MySQL is running on port **3308**. The application will automatically create the `smart_campus` database and `resources` table on first run.

- **Username**: root
- **Password**: root
- **Database Name**: smart_campus

### 2. Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd PAF
   ```
2. Run the application:
   ```bash
   mvnw spring-boot:run
   ```
   The backend will start on [http://localhost:8080](http://localhost:8080).

#### Default Credentials (Basic Auth)
- **Username**: `admin`
- **Password**: `admin123`
*Note: Public GET requests are permitted, but resource modifications require these credentials.*

### 3. Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Features
- **Resource Management**: Create, Read, Update, and Delete campus resources (Labs, Lecture Halls, etc.).
- **Advanced Search**: Filter resources by type, capacity, and location.
- **Analytics Dashboard**: Real-time distribution charts and statistics.
- **Role-Based Security**: Secured endpoints using Spring Security and Basic Auth.
- **Global Error Handling**: Standardized JSON error responses and structured logging.

## API Documentation
- `GET /`: API Health Check/Welcome
- `GET /api/resources`: List all resources
- `GET /api/resources/analytics`: Get summary statistics
- `POST /api/resources`: Register new resource (Requires Admin)
- `PUT /api/resources/{id}`: Update resource (Requires Admin)
- `DELETE /api/resources/{id}`: Remove resource (Requires Admin)
