# Tution Management System

A comprehensive ERP system for managing tuitions and educational institutions. This application allows you to manage students, staff, batches, fees, attendance, and daily operations.

## Features

- **Student Management**: Add, edit, and track student information.
- **Staff Management**: Manage teacher profiles and assignments.
- **Batch Management**: Create and manage batches with schedules.
- **Fee Management**: Track fee payments, installments, and dues.
- **Attendance**: Mark and monitor student attendance.
- **Dashboard**: Quick overview of statistics and analytics.

## Demo

Live demo available at: **[https://learningspace.visionfall.in/](https://learningspace.visionfall.in/)**

## Setup & Installation

Follow the steps below to set up the project locally.

### Prerequisites

- Node.js >= 18.x
- npm (Node Package Manager)

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd tution_erp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Copy Environment File**
    Copy the sample environment file and adjust if necessary.
    ```bash
    cp .env.example .env
    ```

4.  **Database Setup**
    The application uses SQLite by default. The database file will be automatically created when you start the server.

5.  **Run the Server**
    Start the local development server:
    ```bash
    npm start
    ```
    The application will be accessible at `http://localhost:3000`.

