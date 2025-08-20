# Fleet Management System

This is a web application for managing vehicle bookings, approvals, and usage.

## Table of Contents

-   [Technologies Used](#technologies-used)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Database Setup](#database-setup)
-   [Running the Application](#running-the-application)
-   [Dummy Credentials](#dummy-credentials)
-   [Application Usage Guide](#application-usage-guide)
-   [Activity Diagram](#activity-diagram)

## Activity Diagram

[Activity Diagram](https://drive.google.com/file/d/1oZj2fIzck-Ohl_gfxaeF10_tON2Zxc3R/view?usp=drive_link)

## Technologies Used

-   **Backend:** Node.js (Express.js)
-   **Database:** MySQL (managed with Prisma ORM)
-   **Templating Engine:** EJS (EJS-Mate)
-   **Authentication:** Passport.js
-   **Frontend:** HTML, CSS, JavaScript (with Chart.js for dashboard)

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)
-   MySQL Database (v8.0 or higher recommended)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd fleet_management_system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Dummy Credentials

For testing purposes, you can use the following credentials (if you ran the seed script):

| Role     | Username                 | Password      |
| :------- | :----------------------- | :------------ |
| Admin    | `admin@example.com`      | `admin123`    |
| Approver | `pprover2@example.com`   | `approver456` |
| Approver | `aapprover1@example.com` | `approver123` |

## Application Usage Guide

For Temporary Demonstration, the application can be access via : `http://itstaging.samamajuprima.co.id:3003/login`
Feel free to accessing and give the feedback.

1.  **Login:**
    Navigate to the application URL (e.g., `http://localhost:3000/login`) and log in with the provided credentials.

2.  **Dashboard:**
    The dashboard, displaying statistics and graphs related to vehicle usage and bookings, is accessible to both **Admin** and **Approver** roles.

3.  **Admin Role Features:**
    Users with the **Admin** role have comprehensive access to manage the system:

    -   **Vehicles:** Add, view, and manage vehicle details.
    -   **Drivers:** Add, view, and manage driver information.
    -   **Bookings:** Create new vehicle booking requests, assign drivers and vehicles, and specify approvers.

4.  **Approver Role Features:**
    Users with the **Approver** role focus on the approval workflow:

    -   **Users:** View user accounts.
    -   **Approvals:** View pending booking requests that require their approval.
    -   **Bookings:** View existing booking requests.
    -   Approve or reject booking requests.

5.  **Reporting:**
    -   The dashboard provides a visual overview.
    -   Periodic reports (e.g., vehicle usage, booking history) can be exported (if implemented) from relevant sections.
