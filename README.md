# Job Search Manager

A comprehensive full-stack application to track and manage your job search activities. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### ✨ Core Features
- **User Authentication** - Secure registration and login with JWT
- **Job Tracking** - Add, edit, delete, and track job applications
- **Dashboard Analytics** - Visualize your job search progress with charts and statistics
- **Company Management** - Keep track of companies you're interested in
- **Contact Management** - Manage recruiters and professional contacts
- **Interview Scheduling** - Track interview dates, types, and outcomes
- **Document Management** - Store resumes, cover letters, and other documents
- **Status Tracking** - Track applications through various stages (Wishlist, Applied, Interview, Offer, etc.)
- **Priority Management** - Prioritize job applications (Low, Medium, High)
- **Search & Filters** - Quickly find jobs by status, priority, or keyword

### 📊 Dashboard Features
- Total jobs count
- Active applications counter
- Upcoming interviews
- Response rate percentage
- Jobs by status visualization
- Recent activity feed

## Tech Stack

### Backend
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## Project Structure

```
job-search-manager/
├── server/                 # Backend (TypeScript)
│   ├── config/            # Configuration files
│   │   └── database.ts    # MongoDB connection
│   ├── middleware/        # Custom middleware
│   │   └── auth.ts        # Authentication middleware
│   ├── models/            # Mongoose models with TypeScript interfaces
│   │   ├── User.ts
│   │   ├── Job.ts
│   │   ├── Company.ts
│   │   ├── Contact.ts
│   │   ├── Interview.ts
│   │   └── Document.ts
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── jobs.ts
│   │   ├── companies.ts
│   │   ├── contacts.ts
│   │   ├── interviews.ts
│   │   ├── documents.ts
│   │   └── stats.ts
│   └── index.ts           # Server entry point
│
├── client/                # Frontend (TypeScript)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── JobModal.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Jobs.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── Companies.tsx
│   │   │   ├── Contacts.tsx
│   │   │   ├── Interviews.tsx
│   │   │   ├── Documents.tsx
│   │   │   └── Profile.tsx
│   │   ├── services/      # API services with TypeScript types
│   │   │   └── api.ts
│   │   ├── store/         # State management
│   │   │   └── authStore.ts
│   │   ├── lib/           # Utilities
│   │   │   └── api.ts
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── package.json
│
├── tsconfig.json          # TypeScript config for backend
│
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-search-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root and client dependencies
   npm run install-all
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/job-search-manager
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Run the application**
   
   Development mode (runs both server and client):
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update` - Update user profile (protected)

### Jobs
- `GET /api/jobs` - Get all jobs (protected)
- `GET /api/jobs/:id` - Get single job (protected)
- `POST /api/jobs` - Create new job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)

### Companies
- `GET /api/companies` - Get all companies (protected)
- `GET /api/companies/:id` - Get single company (protected)
- `POST /api/companies` - Create new company (protected)
- `PUT /api/companies/:id` - Update company (protected)
- `DELETE /api/companies/:id` - Delete company (protected)

### Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `POST /api/contacts` - Create new contact (protected)
- `PUT /api/contacts/:id` - Update contact (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

### Interviews
- `GET /api/interviews` - Get all interviews (protected)
- `POST /api/interviews` - Create new interview (protected)
- `PUT /api/interviews/:id` - Update interview (protected)
- `DELETE /api/interviews/:id` - Delete interview (protected)

### Statistics
- `GET /api/stats` - Get dashboard statistics (protected)

## Usage Guide

### Getting Started

1. **Register an account** at `/register`
2. **Login** with your credentials
3. **Add companies** you're interested in (optional)
4. **Add jobs** you want to track
5. **Schedule interviews** for your applications
6. **Track progress** on the dashboard

### Job Status Workflow

```
Wishlist → Applied → Interview → Offer → Accepted/Declined
                              ↓
                          Rejected
```

### Priority Levels
- **High** - Top priority applications
- **Medium** - Standard priority
- **Low** - Backup options

## Development

### Backend Development
```bash
npm run server
```

The server runs on port 5000 with nodemon for auto-reloading.

### Frontend Development
```bash
npm run client
```

The client runs on port 5173 with Vite's hot module replacement.

### Building for Production

```bash
# Build the client
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/job-search-manager |
| JWT_SECRET | Secret for JWT signing | - (required) |
| JWT_EXPIRE | JWT expiration time | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- CORS configuration
- Input validation
- MongoDB injection prevention

## Future Enhancements

- [ ] Email notifications for interviews
- [ ] Calendar integration
- [ ] Resume builder
- [ ] Job application templates
- [ ] Advanced analytics and reports
- [ ] Mobile app
- [ ] Export data to CSV/PDF
- [ ] Job board integrations
- [ ] Networking event tracking
- [ ] Salary negotiation tracker

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=5001
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

## Acknowledgments

- Built with the MERN stack
- UI inspired by modern job search platforms
- Icons from Unicode emoji set

---

**Happy Job Hunting! 🎯**
