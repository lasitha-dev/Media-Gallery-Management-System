# Media Gallery Management System

A full-stack web application for managing, sharing, and viewing media files (images, videos, etc.) with user authentication and cloud storage.

---

## Features

### User Authentication
- User registration with email verification (OTP)
- Login with email/password
- Google OAuth login
- Password reset (forgot/reset password)

### Media Management
- Upload multiple media files (images, videos, etc.)
- Store media securely in Cloudinary
- Add metadata: title, description, tags
- **Uploaded images are automatically displayed in the media gallery**
- View your own media and shared media
- Edit media metadata and sharing status
- Delete media
- Download selected media as a zip archive
- Filter/search media by tags and keywords

### User Interface
- Responsive React frontend with Tailwind CSS
- Grid and list views for media gallery
- **Uploaded images appear instantly in the gallery view**
- Image detail view with edit and share options
- Drag-and-drop file upload
- Download panel for batch downloads

---

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Cloudinary
- **Authentication:** JWT, Google OAuth, OTP email verification
- **Other:** Axios, React Hot Toast, React Select, Masonry layout

---

## Project Structure

```
Media-Gallery-Management-System/
├── backend/
│   ├── controllers/      # Auth and media controllers
│   ├── models/           # User and Media Mongoose models
│   ├── routes/           # API route definitions
│   ├── utils/            # Cloudinary config, OTP, etc.
│   ├── middlewares/      # Auth middleware, error handling
│   └── server.js         # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components (gallery, upload, auth, etc.)
│   │   ├── pages/        # Main pages (gallery, upload, auth, etc.)
│   │   ├── services/     # API service modules
│   │   └── utils/        # Validation, helpers
│   └── index.html        # App entry point
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for media storage)

### Backend Setup
1. `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following (example):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the backend server: `npm run dev` or `npm start`

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend dev server: `npm run dev`

### Access the App
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## Notes
- Make sure your backend `.env` is correctly configured for Cloudinary and MongoDB.
- The app uses JWT for authentication; tokens are stored in local storage or cookies.
- Email features (OTP, password reset) require valid SMTP credentials.

---

## License
MIT 