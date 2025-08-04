# SkillSet - E-Learning Platform

A modern, responsive web application for delivering high-value, niche online courses. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### For Students
- **Course Discovery**: Browse and search through specialized courses
- **Interactive Learning**: Watch videos, read PDFs, and take quizzes
- **Progress Tracking**: Monitor learning progress and resume where you left off
- **Personal Dashboard**: View enrolled courses and track achievements
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile

### For Instructors
- **Course Creation**: Build structured courses with video, PDF, and quiz lessons
- **Student Management**: Track student enrollments and progress
- **Analytics Dashboard**: Monitor course performance and revenue
- **Content Management**: Easy-to-use course builder interface

### Platform Features
- **Secure Authentication**: Student and instructor role-based access
- **Modern UI/UX**: Clean, professional design with Tailwind CSS
- **Type Safety**: Built with TypeScript for robust development
- **State Management**: Zustand for efficient client-side state management
- **Routing**: React Router for seamless navigation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skillset
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Demo Credentials

### Student Account
- **Email**: student@example.com
- **Password**: password123

### Instructor Account
- **Email**: instructor@example.com
- **Password**: password123

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/              # Page components
│   ├── Landing.tsx     # Homepage
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Student dashboard
│   ├── Courses.tsx     # Course catalog
│   ├── CourseView.tsx  # Individual course viewing
│   ├── InstructorDashboard.tsx # Instructor panel
│   └── CreateCourse.tsx # Course creation form
├── store/              # State management
│   ├── authStore.ts    # Authentication state
│   └── courseStore.ts  # Course data state
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type exports
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Primary Colors**: Blue theme (#0ea5e9, #0284c7, #0369a1)
- **Typography**: System fonts with carefully chosen sizes and weights
- **Components**: Reusable button styles, form inputs, and cards
- **Responsive**: Mobile-first approach with breakpoints
- **Accessibility**: Focus states and proper contrast ratios

## 🔧 Key Features Implementation

### Authentication System
- Role-based access (Student/Instructor)
- Persistent login state with Zustand
- Protected routes with automatic redirects
- Mock authentication for demo purposes

### Course Management
- Dynamic course creation with lesson builder
- Support for video, PDF, and quiz content
- Progress tracking with percentage completion
- Enrollment system with instant access

### Interactive Learning
- Video player integration (Vimeo/YouTube support)
- PDF document handling
- Interactive quiz system with scoring
- Lesson navigation and completion tracking

### Responsive Design
- Mobile-first approach
- Optimized layouts for all device sizes
- Touch-friendly interfaces
- Adaptive navigation

## 🚀 Production Deployment

To build for production:

1. Build the application:
```bash
npm run build
```

2. The `dist/` folder contains the production-ready files
3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

This is a demo application showcasing modern React development practices. The codebase demonstrates:

- Modern React patterns with hooks
- TypeScript best practices
- State management with Zustand
- Responsive design with Tailwind CSS
- Professional UI/UX design
- Clean code architecture

## 📄 License

This project is built as a demonstration of web development skills and modern React architecture.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**