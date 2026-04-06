# RELEASE MANAGEMENT SYSTEM (RMS)
## Project Documentation for PPT Presentation

---

# 1. PROBLEM STATEMENT

## 1.1 Background
In software development organizations, managing releases, projects, and tasks efficiently is critical for delivering quality products on time. Traditional manual methods of tracking releases through spreadsheets and emails lead to:
- Lack of centralized visibility
- Poor version control
- Inefficient task allocation
- Delayed releases
- Communication gaps between teams

## 1.2 Problem Definition
The current system lacks an integrated platform to:
- **Track Projects**: Manage multiple software projects in one place
- **Manage Releases**: Plan and track software releases with versions
- **Assign Tasks**: Allocate tasks to team members based on roles
- **Monitor Progress**: Visualize project status through dashboards

## 1.3 Objectives
1. Develop a web-based Release Management System (RMS)
2. Implement role-based access control (Admin, Manager, Worker)
3. Provide dashboard analytics for quick decision-making
4. Enable CRUD operations for Projects, Releases, and Tasks
5. Create an intuitive, professional user interface

## 1.4 Scope
- **In Scope**: Web application with React frontend and Flask backend
- **Out Scope**: Mobile app, email notifications, CI/CD integration

---

# 2. LITERATURE SURVEY

## 2.1 Existing Systems Analysis

| System | Features | Limitations |
|--------|----------|-------------|
| Jira | Project tracking, Agile boards, Integrations | Expensive, Complex setup |
| Trello | Kanban boards, Simple UI | Limited reporting |
| Asana | Task management, Timeline | No release tracking |
| GitHub Projects | Issue tracking, Automation | No formal release management |

## 2.2 Research Findings
- Release management tools often lack integration between projects, releases, and tasks
- Role-based access is crucial for organizational hierarchy
- Visual dashboards improve team productivity
- Modern UI/UX increases user adoption

## 2.3 Proposed Solution Advantages
- **Centralized**: All-in-one platform for projects, releases, tasks
- **Cost-effective**: Open-source solution
- **Customizable**: Easy to modify for specific needs
- **User-friendly**: Modern Material UI interface

---

# 3. PROPOSED METHODOLOGY

## 3.1 Development Approach
**Agile Methodology** with iterative development:
1. **Planning Phase**: Requirements gathering
2. **Design Phase**: UI/UX design, database schema
3. **Implementation Phase**: Frontend & Backend development
4. **Testing Phase**: Unit testing, integration testing
5. **Deployment Phase**: Local server deployment

## 3.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Projects │  │ Releases │   │
│  │  Page    │  │  Page    │  │  Page    │  │  Page    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│        │             │             │             │          │
│        └─────────────┴─────────────┴─────────────┘          │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │  Auth Context │                         │
│                    │  (JWT/Token)  │                         │
│                    └──────┬──────┘                          │
└───────────────────────────│──────────────────────────────────┘
                            │ HTTP Requests
┌───────────────────────────│──────────────────────────────────┐
│                      SERVER (Flask)                         │
│                    ┌──────┴──────┐                          │
│                    │  API Routes  │                          │
│                    └──────┬──────┘                          │
│        ┌──────────────────┼──────────────────┐             │
│  ┌─────┴─────┐    ┌───────┴───────┐   ┌──────┴──────┐      │
│  │  Projects │    │   Releases    │   │    Tasks    │      │
│  │   Routes  │    │    Routes     │   │   Routes    │      │
│  └─────┬─────┘    └───────┬───────┘   └──────┬──────┘      │
│        └──────────────────┼──────────────────┘             │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │   SQLite    │                          │
│                    │  Database   │                          │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 3.3 User Flow Diagram

```
┌─────────┐     ┌──────────┐     ┌────────────┐
│  Login  │────▶│  Auth    │────▶│  Dashboard │
│  Page   │     │  Check   │     │    (Admin) │
└─────────┘     └──────────┘     └────────────┘
                                           │
                                           ▼
                                    ┌────────────┐
                                    │  Sidebar   │
                                    │  Navigation│
                                    └────────────┘
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              ┌──────────┐    ┌───────────┐    ┌─────────┐
              │ Projects │    │ Releases  │    │  Tasks  │
              └──────────┘    └───────────┘    └─────────┘
```

## 3.4 Role-Based Access Control (RBAC)

```
┌────────────────────────────────────────────────┐
│                   ADMIN                        │
│  ✓ View Dashboard                             │
│  ✓ Manage Users (Add/Remove)                 │
│  ✓ Create/Edit/Delete Projects                │
│  ✓ Create/Edit/Delete Releases                │
│  ✓ Create/Edit/Delete Tasks                   │
└────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────┐
│                   MANAGER                       │
│  ✗ View Dashboard (Hidden)                    │
│  ✗ Manage Users (No Access)                   │
│  ✓ Create/Edit/Delete Projects                │
│  ✓ Create/Edit/Delete Releases                │
│  ✓ Create/Edit/Delete Tasks                   │
└────────────────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────┐
│                   WORKER                       │
│  ✗ View Dashboard (Hidden)                    │
│  ✗ Manage Users (No Access)                   │
│  ✗ Projects (Hidden)                          │
│  ✗ Releases (Hidden)                          │
│  ✓ View Tasks                                 │
│  ✓ Update Task Status                         │
└────────────────────────────────────────────────┘
```

---

# 4. METHODOLOGY DIAGRAM

## 4.1 Development Life Cycle

```
    ┌──────────────────────────────────────────────┐
    │           REQUIREMENTS ANALYSIS              │
    │  - User Stories                             │
    │  - Functional Requirements                  │
    │  - Non-Functional Requirements               │
    └────────────────────┬───────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────────────┐
    │                 DESIGN                       │
    │  - UI/UX Design                             │
    │  - Database Schema                          │
    │  - API Architecture                         │
    └────────────────────┬───────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌──────────┐   ┌───────────┐   ┌──────────┐
    │ Frontend │   │   Backend │   │ Database │
    │   Design │   │   Design  │   │  Design  │
    └────┬─────┘   └─────┬─────┘   └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────────────┐
    │              IMPLEMENTATION                 │
    │  - Frontend Development (React + MUI)      │
    │  - Backend Development (Flask)             │
    │  - Database Setup (SQLite)                 │
    └────────────────────┬───────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────────────┐
    │                TESTING                       │
    │  - Unit Testing                             │
    │  - Integration Testing                      │
    │  - User Acceptance Testing                 │
    └────────────────────┬───────────────────────┘
                         │
                         ▼
    ┌──────────────────────────────────────────────┐
    │               DEPLOYMENT                     │
    │  - Local Server Deployment                   │
    │  - Configuration                            │
    └──────────────────────────────────────────────┘
```

## 4.2 Component Architecture

```
React App
│
├── Authentication
│   ├── Login.tsx
│   ├── AuthContext.tsx
│   └── ProtectedRoute.tsx
│
├── Pages
│   ├── Dashboard.tsx (Admin only)
│   ├── Users.tsx (Admin only)
│   ├── Projects.tsx (Admin, Manager)
│   ├── Releases.tsx (Admin, Manager)
│   └── Tasks.tsx (All roles)
│
├── Components
│   ├── SidebarLayout.tsx
│   └── Navbar.tsx
│
└── Services
    └── api.ts (Axios instance)
```

---

# 5. TECH STACK

## 5.1 Technology Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 19.x |
| **UI Library** | Material UI (MUI) | 7.x |
| **Routing** | React Router DOM | 7.x |
| **Charts** | Recharts | 3.x |
| **HTTP Client** | Axios | 1.x |
| **Build Tool** | Vite | 7.x |
| **Language** | TypeScript | 5.x |
| **Backend Framework** | Flask | 3.x |
| **Database** | SQLite | - |
| **ORM** | SQLAlchemy | - |
| **Password Hashing** | Werkzeug | - |
| **CORS** | Flask-CORS | - |

## 5.2 Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.8",
    "@mui/material": "^7.3.8",
    "axios": "^1.13.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "recharts": "^3.7.0"
  }
}
```

## 5.3 Backend Dependencies (requirements.txt)
```
flask==3.1.0
flask-cors==5.0.0
flask-sqlalchemy==3.1.1
werkzeug==3.1.3
```

---

# 6. FRONTEND DESIGN (Figma Description)

## 6.1 Login Page Design

### Layout:
- **Background**: Dark blue gradient (#1a1a2e → #16213e → #0f3460)
- **Card**: Centered glass-morphism effect with white background (95% opacity)
- **Logo**: Gradient avatar with RMS icon

### Components:
1. **Header Section**
   - RMS Logo with gradient background
   - Animated floating circles in background
   - Tagline: "Release Management System"

2. **Login Form**
   - Email input with icon
   - Password input with visibility toggle
   - Gradient submit button
   - Error alert display

### Color Palette:
- Primary Gradient: #667eea → #764ba2
- Background: #1a1a2e
- Card: rgba(255, 255, 255, 0.95)
- Text Primary: #333
- Text Secondary: #666

## 6.2 Dashboard Page Design

### Layout:
- **Sidebar**: Fixed left navigation (260px width)
- **Header**: Top bar with user menu
- **Content Area**: Statistics cards + Charts

### Components:
1. **Statistics Cards** (4 cards in grid)
   - Total Projects (icon: Folder, color: #667eea)
   - Total Releases (icon: LocalOffer, color: #764ba2)
   - Total Tasks (icon: Assignment, color: #2196f3)
   - Completed Tasks (icon: CheckCircle, color: #4caf50)

2. **Charts Section**
   - Bar Chart: Projects, Releases, Tasks overview
   - Pie Chart: Task status distribution

## 6.3 Sidebar Navigation

### Menu Items by Role:
- **Admin**: Dashboard → Users → Projects → Releases → Tasks
- **Manager**: Projects → Releases → Tasks
- **Worker**: Tasks only

### Sidebar Components:
- Logo and app name
- Navigation items with icons
- Active state highlighting
- User profile section
- Logout button

---

# 7. BACKEND DETAILS

## 7.1 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/register | Register new user | Public |
| POST | /api/login | User login | Public |

### Project Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/projects | List all projects | Admin/Manager |
| POST | /api/projects | Create project | Admin/Manager |
| PUT | /api/projects/:id | Update project | Admin/Manager |
| DELETE | /api/projects/:id | Delete project | Admin |

### Release Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/releases | List all releases | Admin/Manager |
| POST | /api/releases | Create release | Admin/Manager |
| PUT | /api/releases/:id | Update release | Admin/Manager |
| DELETE | /api/releases/:id | Delete release | Admin |

### Task Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/tasks | List all tasks | All |
| POST | /api/tasks | Create task | Admin/Manager |
| PUT | /api/tasks/:id | Update task | All |
| DELETE | /api/tasks/:id | Delete task | Admin |

## 7.2 Backend File Structure

```
backend/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── package-lock.json
├── package.json
├── instance/
│   └── rms.db               # SQLite database
└── app/
    ├── __init__.py          # App factory
    ├── extensions.py        # SQLAlchemy init
    ├── models.py            # Database models
    └── routes.py            # API routes
```

## 7.3 Key Backend Files

### app/__init__.py
```python
from flask import Flask
from flask_cors import CORS
from .extensions import db
from .routes import routes

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///rms.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    db.init_app(app)
    CORS(app)
    app.register_blueprint(routes)
    
    return app
```

### app/routes.py (Key Endpoints)
```python
# Login
@routes.route("/api/login", methods=["POST"])
def login():
    # Authenticate user and return user data
    
# Register
@routes.route("/api/register", methods=["POST"])
def register():
    # Create new user with hashed password
    
# Projects CRUD
@routes.route("/api/projects", methods=["GET", "POST"])
@routes.route("/api/projects/<int:id>", methods=["PUT", "DELETE"])

# Releases CRUD
@routes.route("/api/releases", methods=["GET", "POST"])
@routes.route("/api/releases/<int:id>", methods=["PUT", "DELETE"])

# Tasks CRUD
@routes.route("/api/tasks", methods=["GET", "POST"])
@routes.route("/api/tasks/<int:id>", methods=["PUT", "DELETE"])
```

---

# 8. DATABASE SCHEMA

## 8.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      USER      │       │    PROJECT      │       │    RELEASE      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)        │       │ id (PK)         │       │ id (PK)         │
│ name           │       │ name            │       │ name            │
│ email (unique) │       │ description     │       │ version         │
│ password       │       │ created_by (FK) │──────▶│ status          │
│ role           │       │ created_at      │       │ project_id (FK)│──────┐
└─────────────────┘       └─────────────────┘       └─────────────────┘    │
        │                                                                   │
        │                                                                   │
        │                    ┌─────────────────┐                            │
        │                    │      TASK       │                            │
        │                    ├─────────────────┤                            │
        └───────────────────▶│ id (PK)         │◀───────────────────────────┘
                             │ title           │
                             │ status          │
                             │ release_id (FK) │
                             │ assigned_to (FK)│
                             └─────────────────┘
```

## 8.2 Table Definitions

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Releases Table
```sql
CREATE TABLE releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    release_id INTEGER REFERENCES releases(id) ON DELETE CASCADE,
    assigned_to INTEGER REFERENCES users(id)
);
```

## 8.3 Model Classes (Python/SQLAlchemy)

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    releases = db.relationship("Release", backref="project", cascade="all, delete")

class Release(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="Pending")
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    tasks = db.relationship("Task", backref="release", cascade="all, delete")

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="Open")
    release_id = db.Column(db.Integer, db.ForeignKey("releases.id"), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"))
```

---

# 9. BOILERPLATE STRUCTURE

## 9.1 Project Directory Structure

```
release/                           # Project Root
│
├── TODO.md                        # Task tracking
├── PROJECT_DOCUMENTATION.md       # This file
│
├── backend/                       # Flask Backend
│   ├── app.py                     # Main entry point
│   ├── requirements.txt          # Python dependencies
│   ├── package-lock.json
│   ├── package.json
│   ├── instance/
│   │   └── rms.db                 # SQLite database
│   │
│   └── app/
│       ├── __init__.py           # App factory
│       ├── extensions.py          # DB initialization
│       ├── models.py              # SQLAlchemy models
│       └── routes.py              # API endpoints
│
└── frontend/                      # React Frontend
    ├── package.json               # Node dependencies
    ├── vite.config.ts            # Vite configuration
    ├── tsconfig.json              # TypeScript config
    ├── index.html                 # HTML entry
    │
    ├── public/
    │   └── vite.svg              # Static assets
    │
    └── src/
        ├── main.tsx              # React entry point
        ├── App.tsx                # Main app component
        ├── App.css                # Global styles
        ├── index.css              # Index styles
        │
        ├── api.ts                # Axios API instance
        ├── auth.ts               # Auth utilities
        │
        ├── context/
        │   └── AuthContext.tsx   # Auth state management
        │
        ├── components/
        │   ├── Navbar.tsx
        │   └── SidebarLayout.tsx
        │
        ├── pages/
        │   ├── Login.tsx         # Login page
        │   ├── Dashboard.tsx     # Admin dashboard
        │   ├── Users.tsx         # User management
        │   ├── Projects.tsx      # Projects CRUD
        │   ├── Releases.tsx      # Releases CRUD
        │   ├── Tasks.tsx         # Tasks CRUD
        │   ├── Projects.css
        │   ├── Releases.css
        │   └── Tasks.css
        │
        ├── ProtectedRoute.tsx    # Route protection
        │
        └── services/
            └── api.ts
```

## 9.2 How to Run the Project

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 9.3 Default User Roles

| Role | Access Level | Can Create |
|------|--------------|------------|
| Admin | Full Access | Users, Projects, Releases, Tasks |
| Manager | Limited | Projects, Releases, Tasks |
| Worker | View Only | - |

---

# 10. FUTURE ENHANCEMENTS

1. **Email Notifications**: Alert users on task assignments
2. **Drag & Drop**: Kanban-style task management
3. **File Attachments**: Upload release documents
4. **Time Tracking**: Log hours spent on tasks
5. **API Integration**: Connect with GitHub/GitLab
6. **Mobile App**: React Native mobile client
7. **Reports**: Export to PDF/Excel

---

*Document Generated for Project Presentation*
*Release Management System (RMS)*

