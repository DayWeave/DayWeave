# DayWeave

A comprehensive academic calendar and assignment management application designed to help students organize their coursework, schedule study time, and synchronize with Canvas LMS.

## Features

### 🗓️ **Calendar Management**
- Interactive calendar with month, week, and day views
- Visual assignment tracking with due dates and priorities
- Course-based color coding
- Drag-and-drop assignment management

### 📚 **Assignment Management**
- Create, edit, and delete assignments
- Priority levels (High, Medium, Low)
- Due date tracking with overdue indicators
- Assignment filtering and sorting
- Estimated time tracking

### ⏰ **Smart Assignment Scheduler**
- Automatic study session generation
- Customizable study preferences (session length, break time, preferred hours)
- Conflict detection and resolution
- Buffer time before due dates
- Weekend study options

### 🎨 **Canvas LMS Integration**
- Connect to Canvas courses and assignments
- Automatic assignment import
- Real-time synchronization
- Course selection and filtering
- Customizable sync settings

### ⚙️ **Settings & Preferences**
- Notification preferences (email, browser, reminders)
- Calendar customization (view, week start, time format)
- Study session defaults
- User profile management

### 🔐 **Authentication**
- Firebase-powered user authentication
- Secure login and signup
- User-specific data isolation

## Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with custom components
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Routing**: React Router DOM
- **UI Components**: Material-UI (MUI)
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DayWeave
```

2. Navigate to the frontend directory:
```bash
cd FrontEnd
```

3. Install dependencies:
```bash
npm install
```

4. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/firebase.js` with your Firebase config

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
FrontEnd/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── firebase.js            # Firebase configuration
│   ├── Home/                  # Landing page
│   ├── Login/                 # User authentication
│   ├── Signup/                # User registration
│   ├── Dashboard/             # Main dashboard with navigation
│   ├── Calendar/              # Calendar view and management
│   ├── AssignmentList/        # Assignment listing and management
│   ├── AssignmentScheduler/   # Smart scheduling system
│   ├── CanvasIntegration/     # Canvas LMS integration
│   ├── Settings/              # User preferences and settings
│   ├── Contact/               # Contact information
│   └── NavBar/                # Navigation component
```

## Usage

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Dashboard**: Access all features through the main dashboard
3. **Calendar**: View and manage assignments in calendar format
4. **Assignments**: Create and manage assignment lists
5. **Scheduler**: Generate optimal study schedules
6. **Canvas Sync**: Connect and sync with Canvas LMS
7. **Settings**: Customize your experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact us through the Contact page in the application.
