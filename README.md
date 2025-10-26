# CollegeCoursera

A mini-Coursera platform designed specifically for college students and professors. Features a dynamic, fluid UI with auto-grading system and intelligent course recommendations.

## 🚀 Features

- **User Roles**: Students, Creators, Professors, and Admins
- **Course Management**: Create, edit, and manage courses with modules, lectures, and assignments
- **Auto-Grading**: MCQ-based grading system with instant feedback
- **Smart Recommendations**: Tag-based course recommendations
- **Liquid UI**: Beautiful, fluid animations with Framer Motion
- **Real-time Updates**: Live course progress and notifications
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **NextAuth.js** for authentication

### Backend
- **Express.js** with TypeScript
- **MySQL** database
- **Prisma** ORM
- **JWT** authentication
- **Google OAuth** integration

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd collegecoursera
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 3. Database Setup

#### Option A: Using the SQL Script
```bash
# Connect to MySQL and run the setup script
mysql -u root -p < database/setup.sql
```

#### Option B: Using Prisma
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Environment Configuration

#### Backend (.env)
```bash
cp backend/env.local backend/.env
# Edit backend/.env with your MySQL credentials
```

#### Frontend (.env.local)
```bash
cp frontend/env.local frontend/.env.local
# Edit frontend/.env.local with your configuration
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

## 📁 Project Structure

```
collegecoursera/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Main server file
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── database/               # Database setup scripts
│   └── setup.sql
└── package.json           # Root package.json
```

## 🗄 Database Schema

The application uses the following main entities:

- **Users**: Students, Creators, Professors, Admins
- **Courses**: Course information and metadata
- **Modules**: Course sections
- **Lectures**: Video content and materials
- **Assignments**: MCQ-based assessments
- **Enrollments**: Student course registrations
- **Reviews & Comments**: Course feedback and discussions

## 🔐 Authentication

The application supports:
- Google OAuth integration
- JWT-based session management
- Role-based access control (RBAC)

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/setup-profile` - Setup user profile

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `POST /api/courses/:id/enroll` - Enroll in course
- `DELETE /api/courses/:id/unenroll` - Unenroll from course

### Assignments
- `POST /api/assignments/:id/submit` - Submit assignment
- `GET /api/assignments/:id/results` - Get assignment results

## 🎨 UI Components

The application features:
- **Liquid Flow Design**: Smooth, fluid animations
- **Glass Morphism**: Modern glass-like effects
- **Responsive Layout**: Mobile-first design
- **Dark/Light Themes**: User preference support
- **Accessibility**: WCAG compliant components

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Heroku)
```bash
cd backend
# Configure environment variables
# Deploy using your preferred platform
```

### Database (MySQL)
- Use a managed MySQL service (AWS RDS, PlanetScale, etc.)
- Update DATABASE_URL in production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@collegecoursera.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Video streaming integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Live coding sessions
- [ ] Peer review system

---

**Built with ❤️ for the college community**

