# ReserveIt! 🎯

A full-stack booking system developed as a university assignment to demonstrate proficiency in modern web development technologies. The project implements a complete reservation platform using React, Node.js, Express, and MongoDB.

## 📝 About the Project

ReserveIt! is a modern reservation platform that connects users with service providers. The application enables users to discover businesses, schedule appointments, and manage bookings across various service categories including restaurants, cafes, hotels, gyms, spas, and beauty salons.

## ✨ Key Features

**User Features:**
- Browse and search companies by category
- View detailed company information and services
- Book appointments with date and time selection
- Manage personal reservations in dashboard
- View, edit, and delete account profile

**Company Features:**
- Receive and manage incoming reservations
- Confirm, complete, or cancel bookings
- View reservation statistics
- Manage company profile and services

**Authentication & Security:**
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes with role-based access
- Separate registration for users and companies

## 💻 Tech Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.20.0
- Vite 5.0.8
- Axios 1.6.2
- CSS3

**Backend:**
- Node.js
- Express 4.18.2
- MongoDB Atlas
- Mongoose 8.0.3
- JWT 9.0.2
- bcryptjs 2.4.3

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

Backend will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:3001`

## 📁 Project Structure

```
ReserveIT/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── server.js        # Express server
├── src/
│   ├── components/      # React components
│   ├── context/         # Auth & Theme context
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   └── App.jsx          # Main app component
└── package.json
```

## 🗂️ API Endpoints

**Authentication:**
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/companies/register` - Company registration
- `POST /api/companies/login` - Company login

**Reservations:**
- `GET /api/reservations/user/:id` - Get user reservations
- `GET /api/reservations/company/:id` - Get company reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

**Profile Management:**
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `PUT /api/companies/:id` - Update company profile
- `DELETE /api/companies/:id` - Delete company account

## 👤 Demo Accounts

**User Account:**
- Email: `john@example.com`
- Password: `password123`

**Company Account:**
- Email: `luxe.salon@example.com`
- Password: `password123`

## 📄 License

This project was created for educational purposes as a university assignment.

## 👨‍💻 Author

Erik Balic - [GitHub](https://github.com/erikbalic1)

---

**Built with React, Node.js, Express & MongoDB** ⚡
