# InkFlow - Premium Blogging Platform

InkFlow is a modern, high-performance, and visually stunning blogging platform built using the MERN stack (MongoDB, Express, React, Node.js). It offers a complete writing ecosystem for creators, deep social engagement tools for readers, and a comprehensive analytics and moderation suite for administrators.

---

## 🚀 Key Features

### For Readers & Creators
- **Interactive Reading Mode**: High-fidelity post rendering with a dynamic reading progress indicator, smooth scroll animations, and an interactive Table of Contents generated automatically from headings.
- **Social Engagement**:
  - Likes and bookmark systems for post curation.
  - Nested comment threads (parent comments and replies) with comment liking.
  - Flagging/reporting system to report spam or offensive comments.
- **Advanced Search & Discoverability**: Search post content, filter by category slug, search by tags, and read recommendations from related articles.
- **Rich Editor**: Create and edit posts using a visual editor that includes cover image uploads.
- **Profile Management**: Customize your public profile page displaying your location, bio, custom avatar, and overall engagement metrics.

### For Administrators (Admin Portal)
- **Interactive Analytics Dashboard**:
  - Live statistics for total users, published articles, overall comments, and views.
  - Interactive charts (using ChartJS) depicting monthly views trends and category-wise article breakdown.
- **Users Management**: View all users on the platform, toggle user roles (promote to admin / demote to user), and delete user accounts (including cascading deletes of all their posts and comments).
- **Flagged Comments Queue**: Review comments reported by users. Admins can permanently delete offensive comments or dismiss reports to restore comment status.

### Theme & Styling
- **Persistent Dark/Light Mode**: Smooth transitions between light and dark modes with local storage persistence.
- **Glassmorphism UI**: High-end modern styling with blurred overlays, gradients, and micro-interactions powered by Framer Motion.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Core Framework**: React (v18) with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React & React Icons
- **Animations**: Framer Motion
- **Charts**: ChartJS & React-Chartjs-2
- **State/API Client**: Axios with automatic JWT injection interceptors
- **Alerts**: React Toastify

### Backend (Server)
- **Runtime Environment**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & Bcryptjs password hashing
- **File Uploads**: Multer (local static upload folder mapping)
- **Validation**: Express Validator middleware

---

## ⚙️ Project Setup & Installation

### Prerequisites
Make sure you have Node.js and MongoDB installed and running on your system.

### 1. Clone & Install Dependencies

Open a terminal and run the following in both folders:

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory (you can copy `.env.example` as a template):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/premium_blog_db
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_URL=
```

### 3. Seed the Database

To prepopulate your local database with categories, mock users, articles, likes, bookmarks, and reported comments, run the seed script from the `server` directory:

```bash
cd server
npm run seed
```

### 4. Running the Application

**Start Backend Server:**
```bash
cd server
npm run dev
```
*Backend runs on `http://localhost:5000`*

**Start Frontend Development Server:**
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🛡️ Seed Credentials (Local Testing)
To explore administrative and author functionalities, log in using these default credentials:

- **Admin Account**:
  - **Email**: `kaustubh@example.com`
  - **Password**: `password123`
- **User Accounts**:
  - **Emails**: `mishika@example.com`, `anshika@example.com`, `dhanshika@example.com`
  - **Password**: `password123`
