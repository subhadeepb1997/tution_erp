# Tution Management System

A comprehensive ERP system for managing tuitions and educational institutions. This application allows you to manage students, staff, batches, fees, attendance, and daily operations.

## Features

- **Student Management**: Add, edit, and track student information.
- **Staff Management**: Manage teacher profiles and assignments.
- **Batch Management**: Create and manage batches with schedules.
- **Fee Management**: Track fee payments, installments, and dues.
- **Attendance**: Mark and monitor student attendance.
- **User Management**: Secure login with role-based access (Admin/Staff).
- **Dashboard**: Quick overview of statistics and analytics.

## Demo

Live demo available at: **[https://learningspace.visionfall.in/](https://learningspace.visionfall.in/)**

## Setup & Installation

Follow the steps below to set up the project locally.

### Prerequisites

- PHP >= 8.1
- MySQL >= 8.0 (or MariaDB)
- Composer

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd tution_erp
    ```

2.  **Install dependencies**
    ```bash
    composer install
    ```

3.  **Copy Environment File**
    Copy the sample environment file and fill in your database credentials.
    ```bash
    cp .env.example .env
    ```
    Edit `.env` with your DB details:
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=root
    DB_PASSWORD=your_password
    ```

4.  **Generate Application Key**
    ```bash
    php artisan key:generate
    ```

5.  **Database Setup**
    Run the migrations to create the necessary tables:
    ```bash
    php artisan migrate
    ```

6.  **Run the Server**
    Start the local development server:
    ```bash
    php artisan serve
    ```
    The application will be accessible at `http://localhost:8000`.

### Default Credentials

- **Email**: [EMAIL_ADDRESS]`
- **Password**: `admin123`
