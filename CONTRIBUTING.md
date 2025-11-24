# Contributing to VRMS Frontend (React)

Thank you for contributing to the VRMS Frontend!  
This service is part of the larger **Volunteer Resource Management System (VRMS)** ecosystem.

Before contributing, please **also read the main contribution guide**:

👉 **Main Contribution Guide:**  
[CONTRIBUTING.md](https://github.com/udaysingh21/Volunteer-Resource-Management-System/blob/main/CONTRIBUTING.md)

---

## 📁 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client for API requests

---

## Running the Service Locally

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher) or yarn
- Git

### 1. Navigate to the frontend directory
```bash
cd vrms-frontend
```

### 2. Install dependencies
```bash
npm install
# OR
yarn install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your local configuration
```

### 4. Start the development server
```bash
npm run dev
# OR
yarn dev
```

### 5. Open your browser

Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

---

## Project Structure
```
vrms-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layers
│   │   ├── api.js         # Main API configuration
│   │   ├── ngoService.js  # NGO-related API calls
│   │   └── volunteerApi.js # Volunteer-related API calls
│   ├── assets/            # Images, icons, and other assets
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   └── main.jsx          # Application entry point
├── package.json          # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```




## 📝 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>[optional scope]: <description>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring without functional changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process or auxiliary tool changes

### Examples
```
feat(auth): add volunteer registration form
fix(dashboard): resolve navigation menu not closing on mobile
docs: update API integration documentation
style(components): format code according to ESLint rules
```

---

## How to Contribute

### 1. Create a feature branch
```bash
git checkout -b feature/my-change
```

### 2. Make your changes

Follow the coding standards and guidelines above.

### 3. Test your changes
```bash
# Run development server
npm run dev

# Test production build
npm run build

# Run linter
npm run lint
```

### 4. Commit and push
```bash
git commit -am "feat: describe your change"
git push origin feature/my-change
```

### 5. Open a Pull Request

Open a Pull Request in this frontend repo, **not** in VRMS.

#### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Changes have been tested locally
- [ ] ESLint passes without errors
- [ ] Build succeeds without warnings
- [ ] UI changes are responsive and accessible
- [ ] API integrations work correctly
- [ ] Documentation is updated if necessary

---

## Updating in VRMS (Submodule Pointer)

After your PR is merged, update the VRMS meta-repository:
```bash
cd ../VRMS
git add vrms-frontend
git commit -m "Update submodule pointer for vrms-frontend"
git push
```


## API Integration Guidelines

When working with API integrations:

1. Use the existing **API service layers** in `src/api/`
2. Implement proper **error handling** with user-friendly messages
3. Add **loading states** for better user experience
4. Follow **REST conventions** for new API endpoints
5. Test with **mock data** when backend services are unavailable

### Backend Services

This frontend integrates with 5 backend microservices:

1. **User Service** - Authentication and user management
2. **NGO Service** - NGO-related operations
3. **Volunteer Service** - Volunteer management
4. **Opportunity Service** - Volunteer opportunities
5. **Application Service** - Application management

---


**Thank you again for contributing!**