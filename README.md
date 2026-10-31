# 💰 Mini Smart Expense Tracker – ExpenseFlow

## 📌 Project Overview
ExpenseFlow is a web-based application designed to help users record, manage, and monitor their daily expenses through a simple and user-friendly interface.

## ✨ Features
- User Login and Signup Interface
- Expense Dashboard
- Add and Delete Expenses
- Transaction History
- Spending Summary
- Total Expense Calculation
- Average Expense Calculation
- Separate demo expense records for different user profiles

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- PostgreSQL

### Cloud Technologies
- AWS EC2 – Hosts the backend server.
- AWS Amplify – Hosts the frontend application.
- AWS IAM – Manages AWS resource permissions.
- Amazon Linux 2023 – Operating system used on EC2.
- Amazon S3 – CSV report upload functionality was tested separately.

## ☁️ AWS Deployment
- Frontend deployed using AWS Amplify.
- Backend deployed on an AWS EC2 instance.
- Node.js application managed using PM2.
- PostgreSQL configured on the EC2 instance.
- IAM role configured for EC2 access to S3.
- S3 CSV upload tested successfully.

## 📂 Project Structure

```text
ExpenseFlow/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
node server.js
```

Configure the required environment variables before starting the backend.

## 🔐 Security
- Environment variables are used for sensitive database configuration.
- AWS IAM roles provide permissions for AWS resource access.
- EC2 Security Groups control network traffic.

## 🧪 Testing
- Tested frontend functionality.
- Verified backend API response.
- Checked PostgreSQL service status.
- Verified backend process using PM2.
- Tested CSV report uploads to Amazon S3.

## 👥 Team Project
Developed as an academic project to demonstrate frontend development, backend development, database management, and AWS cloud deployment.

## 🎯 Conclusion
ExpenseFlow provides a simple and organised way to manage everyday expenses. The project helped us gain practical experience in web application development and cloud deployment.
