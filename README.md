# 💍 Private RSVP Invitation Platform

A secure, custom-built RSVP website designed for a private event invitation experience.  
This project replaces traditional paper invitations and generic RSVP forms with a personalized, password-protected web application that provides guests with a smooth digital experience while giving the organizer full control over responses.

The application is currently **actively used by the client**, who is satisfied with the final product and user experience. I continue to **maintain and support the platform**, making improvements, updates, and feature changes whenever required.

---

## 🎥 Demo Video

> https://drive.google.com/drive/folders/1fEFaGCVEiJS_Kq3lxRimkYpFhDRtXqPT?usp=sharing

---

# ✨ Project Overview

The client requested a dedicated website instead of relying on paper RSVP cards or generic online forms.  

The solution delivers:

- A warm, personalized invitation experience
- Secure guest-only access
- Easy RSVP submission
- Administrative RSVP management
- Reliable database storage
- Automated validation and deadline handling

The goal was to create a simple, elegant, and reliable platform that feels like a premium invitation experience rather than a standard form.

---

# 🚀 Key Features

## 👥 Guest Experience

### 🔐 Secure Invitation Access
- Guests must enter a shared password before viewing the invitation
- Prevents unauthorized access to private event details
- Protected invitation flow using a dedicated login page

### 💌 Invitation Page
- Personalized invitation message
- Event deadline display
- Contact information section
- Responsive design for desktop and mobile users

### 📝 RSVP System
Guests can:
- Confirm attendance
- Provide guest count
- Submit RSVP details securely

Includes:
- Form validation
- Success and error feedback messages
- Automatic RSVP closure after **July 12, 2026**

---

# 🛠️ Admin Dashboard

A separate administration system allows event organizers to manage responses efficiently.

## Admin Features

- Secure admin login
- JWT-based authentication
- View all RSVPs
- Display RSVPs ordered by newest submissions
- Calculate total attending guests automatically
- Remove individual RSVP entries
- Optional email notification when RSVPs are deleted

---

# ⚙️ Backend API

Built with Express.js and PostgreSQL, providing a reliable backend for authentication, RSVP handling, and administration.

## Available Endpoints

### Health Check
```
GET /health
```

### Guest Authentication
```
POST /login
```

### Submit RSVP
```
POST /rsvp
```

### Admin Authentication
```
POST /admin/login
```

### Retrieve RSVPs
```
GET /admin/rsvps
```

### Delete RSVP
```
DELETE /admin/rsvps/:id
```

---

# 🧰 Technology Stack

## Frontend
- React 18
- React Router 6
- Create React App
- Responsive UI design

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- `pg` PostgreSQL client

## Authentication
- Guest password authentication
- JWT-based admin sessions

## Additional Services
- SMTP email notifications (optional)

---

# 🏗️ Application Architecture

```
Frontend (React)
        |
        |
        ↓
Express REST API
        |
        |
        ↓
PostgreSQL Database
```

The application follows a clear separation between:

- User interface
- Authentication logic
- API services
- Database operations
- Administrative functionality

This makes the platform easier to maintain, extend, and adapt for future requirements.

---

# 🔒 Security Considerations

Implemented security measures include:

- Protected guest invitation routes
- Separate admin authentication system
- JWT session handling
- Server-side validation
- Database-backed RSVP storage
- Restricted access to private event information

---

# 📱 Real-World Deployment

This project is not only a demonstration application — it is a **live client project currently being used in a real event environment**.

The client requested a custom solution tailored to their needs, and the delivered platform successfully replaced manual RSVP management.

I remain responsible for:

- Website maintenance
- Bug fixes
- Feature improvements
- Future modifications requested by the client

---

# 🔮 Future Improvements

Potential future enhancements include:

- Advanced admin analytics
- Guest invitation personalization
- Automated reminder emails
- Improved event management features
- Additional customization options

---

# 👨‍💻 Developer

Created, deployed, and maintained by:

Emmanuel Ofu Odu

Full-stack developer focused on building practical, user-focused applications with modern web technologies.

---

⭐ If you are interested in discussing this project, improvements, or similar solutions, feel free to reach out.
