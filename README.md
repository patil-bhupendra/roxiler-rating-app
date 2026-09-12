# Roxiler Rating APP

A full-stack store rating application developed as part of the Roxiler Systems FullStack Coding Challenge.

The application provides role-based access for **System Administrators, Normal Users, and Store Owners**. Users can browse stores and submit ratings, administrators can manage users and stores, and store owners can monitor ratings received for their stores.

---

## Features

### Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Role-based authorization
- Protected routes
- Password update
- Logout
- Password hashing using bcryptjs

### System Administrator

- View dashboard statistics
- View total users, stores, and ratings
- Add users
- Add stores
- Assign store owners
- View all users
- Filter users by name, email, address, and role
- Sort users
- View user details
- View all stores
- Filter stores by name, email, and address
- Sort stores
- View store ratings
- View assigned store owners

### Normal User

- Register an account
- Login
- View available stores
- Search stores by name and address
- View overall store ratings
- View personal submitted rating
- Submit a rating from 1 to 5
- Update an existing rating
- Update password
- Logout

### Store Owner

- Login
- View assigned store
- View average store rating
- View total ratings
- View users who rated the store
- Update password
- Logout

---

## Form Validation

The application follows the validation requirements specified in the coding challenge.

| Field | Validation |
|---|---|
| Name | Minimum 20 and maximum 60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters, at least one uppercase letter and one special character |
| Email | Standard email format |
| Rating | Integer value from 1 to 5 |

Frontend forms provide live validation feedback, while backend validation provides the final validation layer.

---

## Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- Sequelize ORM
- JWT
- bcryptjs

### Database

- MySQL

### Development Tools

- Git
- GitHub
- Postman

---

## Project Structure

```text
roxiler-rating-app/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── ownerController.js
│   │   ├── ratingController.js
│   │   └── storeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── index.js
│   │   ├── Rating.js
│   │   ├── Store.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── storeRoutes.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminAddStore.jsx
│   │   │   ├── AdminAddUser.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminStores.jsx
│   │   │   ├── AdminUserDetails.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── Register.jsx
│   │   │   └── UserDashboard.jsx
│   │   │
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
---

## Database Design

The application uses three main database tables:

### Users

Stores authentication and user role information.

```
User
├── id
├── name
├── email
├── password
├── address
├── role
└── timestamps
```

Supported roles:

```
ADMIN
USER
OWNER
```

### Stores

Stores information about registered stores.

```
Store
├── id
├── name
├── email
├── address
├── ownerId
└── timestamps
```

### Ratings

Stores ratings submitted by users.

```
Rating
├── id
├── rating
├── userId
├── storeId
└── timestamps
```

A user can submit only one rating per store. The existing rating can subsequently be updated.

### Relationships

```
User
 │
 ├── hasMany ──→ Ratings
 │
 └── hasOne ───→ Store
                  (Owner)
 
Store
 │
 └── hasMany ──→ Ratings
 ```

The `Rating` table uses a unique constraint on the combination of `userId` and `storeId` to prevent duplicate ratings for the same store.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a normal user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get authenticated user |
| PUT | `/api/auth/password` | Update password |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/users` | Create a user |
| POST | `/api/admin/stores` | Create a store |
| PUT | `/api/admin/stores/:id/owner` | Assign store owner |
| GET | `/api/admin/dashboard` | Get dashboard statistics |
| GET | `/api/admin/users` | Get users |
| GET | `/api/admin/users/:id` | Get user details |
| GET | `/api/admin/stores` | Get stores |

### Stores

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stores` | Get stores with search options |

### Ratings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ratings` | Submit a rating |
| PUT | `/api/ratings/:storeId` | Update an existing rating |

### Store Owner

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/owner/dashboard` | Get owner dashboard |
---

**Environment Variables**

Create a `.env` file inside the `backend` directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=roxiler_rating_app
DB_PORT=3306
JWT_SECRET=your_jwt_secret
```

The `.env` file should never be committed to GitHub.

---

## Installation

### 1. Clone the repository

```
git clone <repository-url>
cd roxiler-rating-app
```
### 2. Install backend dependencies
```
cd backend
npm install
```

### 3. Configure environment variables

Create:

```
backend/.env
```

Add the required MySQL database credentials and JWT secret.

### 4. Start the backend

```
node server.js
```

The backend runs on:

```
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```
cd frontend
npm install
```

### 6. Start the frontend

```
npm run dev
```

Vite will display the frontend development URL in the terminal.

---

## Authentication Flow

```
User
 │
 ├── Register
 │      ↓
 │   USER account
 │
 └── Login
        ↓
      JWT
        ↓
   Role verification
        │
        ├── ADMIN  → Admin Dashboard
        │
        ├── OWNER  → Owner Dashboard
        │
        └── USER   → User Dashboard
```

JWT authentication is used to protect API endpoints, while role-based middleware controls access according to the user's role.

---

## Rating Flow

```
Normal User
     ↓
View Stores
     ↓
Select Rating 1–5
     ↓
Submit Rating
     ↓
Rating stored in database
     ↓
Overall store rating updated
```

If the user has already rated a store, the existing rating can be modified.

---

## Security
- Passwords are hashed using bcryptjs.
- Authentication uses JWT.
- Protected API routes require a valid JWT.
- Role-based middleware restricts access to authorized users.
- .env is excluded from version control.
- Database constraints prevent duplicate user-store ratings.
- Password validation is enforced according to the challenge requirements.

---

## UI

The frontend uses Tailwind CSS with a consistent responsive interface across:

- Login
- Registration
- User Dashboard
- Admin Dashboard
- Admin Users
- Admin User Details
- Admin Stores
- Admin Add User
- Admin Add Store
- Owner Dashboard

The interface uses reusable styling patterns, responsive layouts, form validation feedback, and role-specific dashboards.

---

## Future Improvements

Possible improvements include:

- Production environment configuration
- Centralized API configuration
- Enhanced error notifications
- Pagination for large datasets
- Additional dashboard analytics
- Production deployment

---

## Author

**Bhupendra Patil**

Full Stack MERN Developer