# Employee Leave Management System (ELMS)

A web-based application built with **Spring Boot** and **Vanilla JavaScript** to streamline leave tracking for organizations.

## 🚀 Features

- **Role-Based Access**: Secure login for Employees and Managers.
- **Leave Application**: Employees can apply for leave (Sick, Vacation, etc.) with overlap validation.
- **Manager Dashboard**: View stats, approve/reject requests, and see team history.
- **Leave Calendar**: Visual calendar for approved leaves.
- **History Tracking**: Complete audit trail of leave actions.

## 🛠️ Tech Stack

- **Backend**: Java 20, Spring Boot 3.x, Spring Data JPA, Spring Security
- **Database**: MySQL 8.0+
- **Frontend**: HTML5, CSS3, JavaScript (ES6)

## ⚙️ Setup & Installation

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/your-repo/elms.git
    cd elms
    ```

2.  **Database Configuration**:

    - Update `src/main/resources/application.properties` with your MySQL credentials:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/elms_db
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```

3.  **Run the Application**:

    ```bash
    ./mvnw spring-boot:run
    ```

4.  **Access the App**:
    - Open your browser and go to: `http://localhost:8080`

## 🧪 Testing Credentials

- **Manager**: Register a new user with any email, then manually change `role` to `MANAGER` in the database (or use provided seed data).
- **Employee**: Use the "Register" link on the login page.

---

_Created for HyScaler Project Assignment_
