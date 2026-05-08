# DIY Project Hub 🛠️

A fully functional web application designed for DIY enthusiasts to share their creative projects, tutorials, and components used. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Features

- **User Authentication**: Secure Register and Login system with JWT and password hashing (bcrypt).
- **Project Management (CRUD)**: Users can create, view, edit, and delete their own projects.
- **Image Gallery**: Support for multiple images per project with a user-definable "main image" (cover photo).
- **Dynamic Search**: Real-time search functionality with debouncing, allowing users to find projects by title, description, or specific components.
- **Interactive Comments**: Community feedback system where users can comment on projects.
- **Responsive UI**: Modern, premium design with smooth animations and a mobile-friendly layout.
- **Protected Routes**: Ensuring that sensitive actions (creating/editing) are only available to authenticated users.

## 🚀 Tech Stack

- **Frontend**: React (Vite), TypeScript, CSS3.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Storage**: Local file storage for images (Multer).

---

## 🛠️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 1. Clone the repository
```bash
git clone https://github.com/Adam-Sidor/diy_project_hub.git
cd diy_project_hub
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/diy_hub
JWT_SECRET=your_super_secret_key
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

To run the full application, you need to start both the backend and the frontend.

### Start Backend
In the `backend` directory:
```bash
node server.js
```
The server will start on `http://localhost:8080`.

### Start Frontend
In the `frontend` directory:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
diy_project_hub/
├── backend/
│   ├── controllers/    # Business logic
│   ├── models/         # Database schemas (Mongoose)
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth and Upload middleware
│   └── uploads/        # Stored project images
├── frontend/
│   └── src/
│       ├── pages/      # View components
│       ├── services/   # API communication
│       ├── context/    # Auth state management
│       ├── types/      # TypeScript definitions
│       └── App.tsx     # Routing and core layout
└── README.md
```

## 📝 License
This project was created for educational purposes.
