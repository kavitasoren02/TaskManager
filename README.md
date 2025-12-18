# Collaborative Task Manager

A full-stack, real-time task management application built with modern technologies. This project demonstrates production-ready architecture with authentication, real-time collaboration via Socket.io, and comprehensive task management features.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Task Management**: Full CRUD operations for tasks with advanced filtering
- **Real-time Collaboration**: Instant task updates using Socket.io (no REST API calls needed)
- **In-app Notifications**: Persistent notification system for task assignments
- **User Dashboard**: Personalized views for assigned, created, and overdue tasks
- **Responsive Design**: Mobile-first approach with Tailwind CSS V4

### Task Attributes
- Title (max 100 characters)
- Description (multi-line)
- Due Date
- Priority (Low, Medium, High, Urgent)
- Status (To Do, In Progress, Review, Completed)
- Creator and Assignee tracking

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR for caching and state management
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Routing**: React Router Dom
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod DTOs
- **Real-time**: Socket.io

## Project Structure

```
Collaborative-Task-Manager/
├── Frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API and Socket utilities
│   │   ├── pages/         # Route pages
│   │   ├── types/         # TypeScript type definitions
│   │   └── index.css      # Tailwind CSS V4 with design tokens
│   ├── package.json
│   └── vite.config.ts
│
├── Backend/               # Express API server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── dto/          # Data Transfer Objects with Zod
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── services/     # Business logic layer
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.io configuration
│   │   ├── types/        # TypeScript interfaces
│   │   └── server.ts     # Entry point
│   └── package.json
│
└── README.md             # This file
```

## Getting Started

### Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Collaborative-Task-Manager
```

#### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your configuration
# MONGO_URI=mongodb://localhost:27017/task-manager
# JWT_SECRET=your-super-secret-key
# FRONTEND_URL=http://localhost:5173
```

#### 3. Frontend Setup
```bash
cd ../Frontend
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your configuration
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Server will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Application will start on http://localhost:5173

#### Production Build

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
Cookie: token=<jwt-token>
```

#### Update Profile
```http
PUT /auth/profile
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "name": "John Updated"
}
```

#### Get All Users
```http
GET /auth/users
Cookie: token=<jwt-token>
```

### Task Endpoints

**Note:** Task creation, updates, and deletion are primarily handled via Socket.io for real-time collaboration. REST endpoints are available for initial data fetching.

#### Get All Tasks
```http
GET /tasks?status=To Do&priority=High
Cookie: token=<jwt-token>
```

Query Parameters:
- `status`: Filter by status (To Do, In Progress, Review, Completed)
- `priority`: Filter by priority (Low, Medium, High, Urgent)
- `assignedToId`: Filter by assigned user
- `creatorId`: Filter by creator

#### Get Task by ID
```http
GET /tasks/:id
Cookie: token=<jwt-token>
```

#### Get Overdue Tasks
```http
GET /tasks/overdue
Cookie: token=<jwt-token>
```

### Notification Endpoints

#### Get Notifications
```http
GET /notifications
Cookie: token=<jwt-token>
```

#### Get Unread Count
```http
GET /notifications/unread-count
Cookie: token=<jwt-token>
```

#### Mark as Read
```http
PUT /notifications/:id/read
Cookie: token=<jwt-token>
```

#### Mark All as Read
```http
PUT /notifications/read-all
Cookie: token=<jwt-token>
```

## Real-time Events

### Socket.io Events

The application uses Socket.io for real-time task operations, providing instant updates to all connected users without REST API calls.

#### Client to Server Events

**task:create** - Create a new task
```javascript
socket.emit('task:create', {
  title: "Complete project",
  description: "Finish the task manager app",
  dueDate: "2025-12-31",
  priority: "High",
  assignedToId: "user-id-here"
}, (response) => {
  if (response.success) {
    console.log('Task created:', response.task);
  } else {
    console.error('Error:', response.error);
  }
});
```

**task:update** - Update an existing task
```javascript
socket.emit('task:update', {
  taskId: 'task-id-here',
  updates: {
    status: 'In Progress',
    priority: 'Urgent'
  }
}, (response) => {
  if (response.success) {
    console.log('Task updated:', response.task);
  }
});
```

**task:delete** - Delete a task
```javascript
socket.emit('task:delete', 'task-id-here', (response) => {
  if (response.success) {
    console.log('Task deleted');
  }
});
```

#### Server to Client Events

- **task:created**: Broadcasted to all users when a task is created
- **task:updated**: Broadcasted to all users when a task is updated
- **task:deleted**: Broadcasted to all users when a task is deleted
- **notification:new**: Sent to specific user when assigned to a task

## Architecture & Design Decisions

### Backend Architecture

**Service Layer Pattern:**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Socket Handlers**: Process real-time events
- **Repositories**: Data access via Mongoose models
- **DTOs**: Input validation using Zod schemas

**Why Socket.io for Task Operations?**
- Real-time collaboration without polling
- Automatic reconnection and error handling
- Event-based architecture for clear separation of concerns
- Reduced server load compared to REST API polling
- Better user experience with instant updates

**Why MongoDB?**
- Flexible schema for rapid development
- Easy horizontal scaling
- Native support for nested documents (tasks with populated users)
- Excellent TypeScript support with Mongoose

**Why JWT with HttpOnly Cookies?**
- Secure against XSS attacks
- Automatic inclusion in requests
- Works seamlessly with CORS credentials
- Industry-standard authentication method

### Frontend Architecture

**Component Structure:**
- Separation of concerns with components, pages, and hooks
- Custom hooks for data fetching (useTasks, useNotifications)
- Real-time hooks (useRealtimeTasks, useRealtimeNotifications)
- Context API for authentication state

**Why SWR?**
- Automatic caching and revalidation
- Real-time experience with optimistic UI updates
- Built-in error handling and retry logic
- Smaller bundle size compared to React Query
- Perfect complement to Socket.io real-time updates

**Why Socket.io Client?**
- Seamless integration with backend Socket.io server
- Automatic reconnection and heartbeat
- TypeScript support with proper typing
- Event-based architecture matches React patterns

**Why Tailwind CSS V4?**
- Inline theme system with design tokens
- No custom CSS classes needed
- Fast development with utility-first approach
- Responsive design out of the box