The client wanted a dedicated website instead of paper RSVPs or a generic form.
The site presents a warm invitation message, contact details, and an RSVP form. 
Access is limited: only people who know the site password can view the invitation and submit a response.

Features:
Guest experience (/)
    Password login (/login) before viewing the invitation
    Invitation header with deadline
    Contact section (email and phone)
    RSVP form with validation and success/error messages
    Form disabled automatically after July 12, 2026
Admin experience (/admin)
    Separate admin password and JWT-based session
    List of all RSVPs (newest first)
    Running total guests attending (sum of guest counts for “yes” responses)
    Remove individual RSVPs
    Optional email when an RSVP is removed
Backend
    Express API with PostgreSQL storage
    Health check: GET /health
    Guest login: POST /login
    Submit RSVP: POST /rsvp
    Admin login: POST /admin/login
    Admin list: GET /admin/rsvps
    Admin delete: DELETE /admin/rsvps/:id
    Optional SMTP notifications for new RSVPs and removals

TECH STACK :

Frontend - React 18, React Router 6, Create React App
Backend - Node.js, Express
Database - PostgreSQL (pg)
Auth -App password (guest), JWT (admin)

