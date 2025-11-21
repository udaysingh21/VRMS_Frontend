# Volunteer Resource Management System (VRMS)

A modern, responsive frontend application for managing volunteer resources and connecting volunteers with NGOs. This React-based application provides an intuitive interface for volunteers, NGOs, and administrators to efficiently manage volunteer activities and opportunities.

## Project Overview

The VRMS Frontend is the user interface layer of a comprehensive Volunteer Resource Management System that facilitates seamless interaction between volunteers and NGOs. Built with React and modern web technologies, it consumes APIs from multiple backend microservices to deliver a complete volunteer management experience.

### Key Features

- **User Authentication & Registration**: Secure login and registration for volunteers, NGOs, and administrators
- **Volunteer Dashboard**: Manage profiles, browse opportunities, track applications and activity history
- **NGO Dashboard**: Create and manage volunteer opportunities, view applications, and track volunteer engagement
- **Opportunity Management**: Search, filter, and apply for volunteer opportunities with real-time updates
- **Profile Management**: Comprehensive profile management for all user types
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Notifications**: Toast notifications for user actions and API responses

## Architecture

This frontend application integrates with **5 backend microservices** to provide a complete volunteer management ecosystem:

### Backend Microservices Integration

1. **User Service**
   - Handles user registration and authentication
   - Manages user profiles for volunteers, NGOs, and admins
   - JWT-based authentication system
   - User role management and permissions

2. **NGO Posting Service**
   - Manages NGO opportunity postings
   - Handles NGO profile management
   - Tracks volunteer applications and slot availability
   - Manages posting status and requirements

3. **Volunteer Service**
   - Manages volunteer profiles and preferences
   - Tracks volunteer activities and history
   - Handles skill and interest management
   - Manages volunteer availability and schedules

4. **Matching Service**
   - Intelligent matching of volunteers to opportunities
   - Algorithm-based recommendations
   - Skill and requirement compatibility analysis
   - Optimization for best-fit placements

5. **Analytics Service**
   - Administrative monitoring and reporting
   - Portal activity analytics and insights
   - Performance metrics and trends
   - Data-driven decision support

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Emoji-based iconography
- **Responsive Design**: CSS Grid & Flexbox

## Project Structure

```
vrms-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── api.js          # User service API client
│   │   └── ngoService.js   # NGO service API client
│   ├── components/
│   │   └── Navbar.jsx      # Navigation component
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VolunteerDashboard.jsx
│   │   ├── NGODashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── BrowseOpportunities.jsx
│   ├── App.jsx             # Main application component
│   └── main.jsx           # Application entry point
├── package.json
└── README.md
```

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

### Backend Services
Make sure all 5 backend microservices are running on their respective ports (local setup):
- User Service: `http://localhost:8080`
- NGO Posting Service: `http://localhost:8082`
- Volunteer Service: `http://localhost:8083`
- Matching Service: `http://localhost:8084`
- Analytics Service: `http://localhost:8085`

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/udaysingh21/VRMS_Frontend.git
cd VRMS_Frontend/vrms-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (if needed):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_NGO_API_BASE_URL=http://localhost:8082
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the app for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## API Integration

The frontend communicates with backend services through well-defined API endpoints:

### User Service APIs
```
POST /auth/login
POST /auth/register
GET /users/volunteers/{id}
GET /users/ngos/{id}
DELETE /users/{id}
```

### NGO Posting Service APIs
```
GET /api/v1/postings
GET /api/v1/postings/domain/{domain}
POST /api/v1/postings
PUT /api/v1/postings/{id}
DELETE /api/v1/postings/{id}
```

## Features

### For Volunteers
- ✅ Browse and search volunteer opportunities
- ✅ Filter opportunities by domain and requirements
- ✅ Apply for opportunities with one click
- ✅ Manage personal profile and skills
- ✅ Track application status and history

### For NGOs
- ✅ Create and manage volunteer opportunities
- ✅ View and manage volunteer applications
- ✅ Update organization profile
- ✅ Monitor volunteer engagement

### For Administrators
- ✅ Dashboard with system analytics
- ✅ Monitor platform activity
- ✅ Generate reports and insights

## Authentication

The application uses JWT (JSON Web Token) based authentication:
- Secure login/logout functionality
- Role-based access control
- Token storage in localStorage
- Automatic token refresh handling

## User Roles

1. **Volunteers**: Browse opportunities, manage profiles, apply for positions
2. **NGOs**: Post opportunities, manage applications, view volunteer profiles
3. **Administrators**: System monitoring, analytics, and overall management

## Security Features

- JWT-based authentication
- Role-based route protection
- CORS handling for cross-origin requests
- Input validation and sanitization
- Secure API communication

## Responsive Design

- Mobile-first approach
- Tablet and desktop optimized layouts
- Touch-friendly interface
- Consistent user experience across devices

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

- **Frontend Development**: React.js with modern UI/UX
- **Backend Integration**: RESTful API consumption
- **System Architecture**: Microservices integration

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built for the volunteer community**
