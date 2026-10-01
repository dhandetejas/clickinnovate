# 🎓 College Exam Timetable & Hall Pass Portal

A full-stack web application designed for academic institutions to manage examination schedules, handle role-based user access, and automatically generate digital, printable exam hall passes for students.

---

## 🌟 Key Features

### 🔐 1. Authentication & Role-Based Access Control
* **Dual Roles**: Supports **Administrator** and **Student** registration and login.
* **Student Metadata**: Captures Full Name, Roll/Registration Number, Academic Year (*1st, 2nd, 3rd, 4th Year*), and Department/Branch (*Computer Science, Electronics & Comm, Mechanical, Civil, Information Tech*).
* **Admin Metadata**: Captures Full Name, Staff ID, and Email Credentials.
* **JWT Authorization**: Encrypted passcodes with `bcryptjs` and stateless JWT tokens stored in localStorage.

### 📅 2. Admin Timetable Dashboard
* **Metrics Summary**: Real-time overview of Total Scheduled Exams, Active Departments, Registered Students, and Upcoming Exam count.
* **Publish Exam Schedule**: Interactive Modal Form with validation:
  * Subject Name & Subject Code
  * Academic Year & Branch
  * Exam Date & Time Slots (*Start Time & End Time*)
  * Hall / Room Allocation Number
* **Strict Validation Rules**: Enforces that **Exam End Time must be strictly after Start Time**, prevents empty fields or past dates.
* **Datatable Management**: Search by subject/room and filter by branch & year with real-time **Delete/Cancel** action.

### 🎟️ 3. Student Timetable & Digital Hall Pass Portal
* **Class Timetable View**: Automatically filters and displays **only** exams matching the logged-in student's Academic Year and Branch.
* **Friendly Empty State**: Displays a clear notification banner when no exams are scheduled for the student's class.
* **Digital Hall Pass Admit Card**:
  * Official university card design with security badge and watermark logo.
  * Displays Student Name, Roll Number, Branch, Academic Year, and Profile seal.
  * Summary table of candidate's exams with assigned room/hall numbers and timings.
  * Verification QR Code Hash representation.
  * Candidate Examination Rules and Instructions.
  * **Print / Download PDF Action**: Integrated `@media print` CSS rules allowing students to generate an official printable admit card with a single click (`window.print()`).

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons.
* **Backend**: Node.js, Express.js REST API.
* **Database**: MongoDB with Mongoose Schema models (`User`, `Exam`).
* **Zero-Config Database Fallback**: Built-in `mongodb-memory-server` fallback ensuring the portal launches and runs smoothly out-of-the-box even without a pre-configured local MongoDB instance!

---

## 🔑 Test Credentials

Click **"Seed Demo Data"** in the top navigation bar or use the following pre-seeded credentials:

| Role | Email | Password | Branch & Academic Year / Staff ID |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@college.edu` | `Password123!` | Staff ID: `ADM-2026-99` |
| **Student** | `student@college.edu` | `Password123!` | CSE • 3rd Year (Roll: `CS2026042`) |

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
* **Node.js**: v18+ installed on your system.
* **npm**: v9+ package manager.

### Steps to Run Locally

1. **Clone / Navigate to directory**:
   ```bash
   cd "C:\Users\VICTUS\OneDrive\ドキュメント\clickinnovate"
   ```

2. **Install all dependencies (Root & Frontend)**:
   ```bash
   npm run install-all
   ```

3. **Build the React Frontend**:
   ```bash
   npm run build
   ```

4. **Start the Production Server**:
   ```bash
   npm start
   ```
   Open your browser at [http://localhost:5000](http://localhost:5000)

5. **Run in Concurrent Development Mode (Optional)**:
   ```bash
   npm run dev
   ```
   * Express API Server runs on [http://localhost:5000](http://localhost:5000)
   * Vite React Hot-Reload Server runs on [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment Instructions

### 1. GitHub Repository Push
```bash
git init
git add .
git commit -m "Initial commit: College Exam Timetable & Hall Pass Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/college-exam-hallpass-portal.git
git push -u origin main
```

### 2. Live Hosting (Render / Railway / Vercel)
* **Environment Variables**:
  * `PORT=5000`
  * `MONGO_URI=your_mongodb_connection_string` (Optional, defaults to in-memory DB)
  * `JWT_SECRET=super_secret_exam_portal_key_2026`
* **Build Command**: `npm run install-all && npm run build`
* **Start Command**: `npm start`
