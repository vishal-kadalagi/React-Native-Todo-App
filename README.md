# React Native To-Do App with Node.js & MongoDB

This project is a comprehensive To-Do list application built with **React Native CLI (TypeScript)**, featuring a custom **Node.js/Express** backend, **MongoDB** database, and **Firebase Authentication**.

It was built strictly to satisfy all requirements and bonus objectives of the Modulus Seventeen React Native Assignment.

---

## 🌟 Features & Assignment Checklist

### Basic Requirements (100% Complete)
- [x] **React Native CLI (TypeScript)**: The app is built using the bare React Native CLI and is fully typed.
- [x] **Authentication Flow**: Users can register and log in seamlessly using Firebase Authentication.
- [x] **Task Management (CRUD)**: Users can Add, View, Complete, and Delete tasks.
- [x] **Task Details**: Every task includes a title, description, scheduled date/time, deadline, and priority level.
- [x] **Custom Backend API**: Includes a dedicated Node.js + Express backend server.
- [x] **MongoDB Storage**: All tasks are stored in a local MongoDB database (`todoapp`).
- [x] **Clean Architecture & Comments**: Code is well-structured into `screens`, `components`, `config`, and `theme`, with inline comments explaining complex logic.

### Bonus Features (100% Complete)
- [x] **Task Due Dates**: Implemented a beautiful native Date & Time picker for deadlines.
- [x] **Custom Sorting Algorithm (Time + Deadline + Priority Mix)**: The dashboard features a complex mathematical algorithm that automatically scores and sorts tasks so the most urgent tasks bubble to the top.
- [x] **Categories / Tags**: Tasks can be tagged as Work, Personal, Health, or Other.
- [x] **Sorting & Filtering**: Filter chips allow users to toggle between "All", "Incomplete", and "Completed" tasks instantly.
- [x] **Visually Appealing UI**: Built from scratch with a stunning, premium dark-mode aesthetic, custom priority badges, micro-interactions, and glassmorphism elements.

---

## 🚀 How to Run the Project

This project consists of two parts: the **Node.js Backend** and the **React Native App**. You will need two terminal windows to run them simultaneously.

### Prerequisites
1. **Node.js** installed on your machine.
2. **MongoDB Community Server** installed and running locally on your machine.
3. **Android Studio** and the Android SDK installed and configured.

### Part 1: Start the Backend Server (Node.js)
The backend server handles all the task data and connects to your local MongoDB database.

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd "backend"
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *You should see a message saying `Connected to MongoDB` and `Server is running on http://0.0.0.0:3000`.*

### Part 2: Start the React Native App
The mobile app communicates with the backend server over your local network.

1. Open a **new, second terminal window**.
2. Navigate to the React Native app folder:
   ```bash
   cd "TodoApp"
   ```
3. Install the app dependencies:
   ```bash
   npm install
   ```
4. Start the Metro Bundler:
   ```bash
   npx react-native start
   ```
5. Open a **third terminal window** (or a new tab), navigate to the `TodoApp` folder again, and compile the Android app:
   ```bash
   npx react-native run-android
   ```

*(Note: If you run into an issue connecting a physical device, make sure your computer's local IP address is correctly set in `TodoApp/src/config/api.ts`).*

---

## 🛠️ Tech Stack
- **Frontend**: React Native CLI, TypeScript, React Navigation
- **Backend API**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Firebase Auth
- **UI & Icons**: Vanilla StyleSheet, react-native-vector-icons, react-native-date-picker
