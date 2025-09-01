# notes-app

■ Notes App Backend
A secure, production-ready backend for Notes and Authentication. Built with Node.js, Express,
TypeScript, MongoDB/Mongoose, JWT, OTP Auth, and optional Google OAuth (Passport.js).
■ Features
- Email + OTP registration & login
- JWT-based stateless authentication
- Google OAuth login (optional)
- Secure Notes CRUD (only owner can list/add/remove)
- Modular structure for easy testing, extending, and interview explanations
■ Project Structure
src/ index.ts app.ts config.ts db.ts middleware/ auth.ts error.ts models/ User.ts Otp.ts Note.ts routes/
auth.routes.ts note.routes.ts utils/ otp.ts .env .gitignore
■ Prerequisites
- Node.js (v18+ LTS)
- Git & VS Code
- MongoDB Atlas cluster (or local MongoDB)
- Google Cloud account (for Google OAuth)
■■ Setup Instructions
1. Clone & Initialize git clone https://github.com/IamVaibhavSinghdev/notes-app cd notes-app npm
install 2. Configure Environment (.env) PORT=4000 MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret NODE_ENV=development OTP_EXP_MIN=5 # Optional for Google
OAuth GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret FRONTEND_URL=https://effulgent-toffee-39d81c.netlify.app/signin
Run the Project npm run dev # Development npm run build # Build npm start # Production
■ API Endpoints
Auth Routes: - POST /auth/request-otp → Request OTP for signup/login - POST /auth/verify-otp →
Verify OTP, issue JWT, create user - GET /auth/google → Start Google OAuth flow - GET
/auth/google/callback → Handle Google OAuth callback Notes Routes (JWT Protected): - GET /notes
→ List notes of logged-in user - POST /notes → Add a new note - DELETE /notes/:id → Delete a note
(only owner)
■ Security Considerations
- OTPs are hashed & time-limited
- JWTs used for stateless, scalable authentication
- Environment variables for secrets & DB credentials
- Central error handling to prevent leaks
■ Highlights
- Mongoose schemas with validation & indexing
- OTP flow: secure, hashed, time-bound
- JWT for scalable, stateless authentication
- Middleware for auth guard & error handling
- RESTful route design
- Git hygiene (.gitignore, no node_modules/.env)
  
