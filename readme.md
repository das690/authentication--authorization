# 🛡️ Secure MERN Authentication & RBAC System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A production-ready full-stack authentication architecture demonstrating secure user provisioning, stateless session management, and Role-Based Access Control (RBAC). 

🔗 **Live Application:** [https://mern-node-auth.netlify.app/](https://mern-node-auth.netlify.app/)
*(Note: The backend API is hosted on Render's free tier. The initial request may take ~50 seconds to wake the server from sleep.)*

---

## 📑 Table of Contents
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)

---

## 🏗️ System Architecture

The application is decoupled into a separate client and server, communicating via a RESTful API.

* **Frontend (Client):** A React Single Page Application (SPA) built with Vite for optimal build speeds. It utilizes `react-router-dom` for client-side routing and Tailwind CSS for a responsive, custom dark-mode UI. Hosted globally on **Netlify**.
* **Backend (API):** A Node.js/Express REST API that handles business logic, password hashing (`bcryptjs`), and JWT generation. Hosted on **Render**.
* **Database:** A **MongoDB Atlas** cloud cluster, interfaced via Mongoose ODM for strict schema validation.

---

## ✨ Key Features

* **Stateless Authentication:** Secure login and registration using JSON Web Tokens (JWT) stored in client `localStorage`.
* **Role-Based Access Control (RBAC):** Custom Express middleware enforces authorization. Users are assigned `user` or `admin` roles, dynamically altering UI rendering and API access.
* **Cryptographic Security:** Passwords are never stored in plaintext; they are hashed and salted prior to database insertion.
* **Protected Client Routes:** Frontend navigation guards prevent unauthenticated users from accessing internal dashboard components.
* **Admin Dashboard:** Exclusive UI panel allowing administrators to fetch and audit all registered user data.

---

## 📡 API Reference

#### Authentication Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Creates a new user account | Public |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT | Public |
| `GET` | `/api/auth/me` | Returns current user profile | **Protected** (Any User) |
| `GET` | `/api/auth/users` | Returns array of all users | **Protected** (Admin Only) |

> **Note:** Protected routes require a valid JWT passed in the request header as: `Authorization: Bearer <token>`

---

## 🔐 Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` file in the `BACKEND` directory:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://admin:password@cluster...` |
| `JWT_SECRET` | 64-character cryptographic string | `a8b7c6d5e4f3...` |

---

## 🚀 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/das690/authentication--authorization.git
cd your-repo-name 
 
 