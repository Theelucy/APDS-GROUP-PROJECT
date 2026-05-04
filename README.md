# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SecureSwift - International Payments Portal 🔒💸

SecureSwift is a secure, full-stack International Payments Portal built using the MERN stack. This project demonstrates the implementation of strict DevSecOps practices and OWASP security controls to protect sensitive financial data and ensure secure transactions.

## 🚀 Key Security Features
*   **DevSecOps Pipeline:** Automated vulnerability scanning (`npm audit`) via GitHub Actions.
*   **Data in Transit:** Enforced HTTPS with local SSL certificates using `mkcert`.
*   **Data at Rest:** Industry-standard **Argon2id** password hashing with unique salting (SQLite).
*   **Authentication & Authorization:** Secure, HttpOnly JWT tokens and strict Role-Based Access Control (RBAC) separating Customer and Employee privileges.
*   **Attack Mitigation:** 
    *   Input whitelisting and validation using `express-validator` to prevent SQL/NoSQL injection.
    *   Brute-force protection via `express-rate-limit` (account lockout after 5 failed attempts).
    *   Defense against XSS and Clickjacking using `Helmet.js` security headers.

## 🛠️ Tech Stack
*   **Frontend:** React (Vite), CSS Modules
*   **Backend:** Node.js, Express.js
*   **Database:** SQLite 
*   **Security & CI/CD:** GitHub Actions, Helmet, Argon2, JSON Web Tokens (JWT)

## ⚙️ Prerequisites
Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v16 or higher)
*   [mkcert](https://github.com/FiloSottile/mkcert) (for local HTTPS certificate generation)

## 📥 Installation & Setup

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/secureswift.git
cd secureswift
\`\`\`

**2. Install Dependencies**
Navigate to both the frontend and backend directories to install the required packages:
\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

**3. Environment Variables**
Create a `.env` file in your root backend directory and add the necessary secret keys (e.g., JWT Secret, Database path, Port numbers).

**4. Generate Local SSL Certificates**
To ensure the app runs on HTTPS locally, use `mkcert` in your backend and frontend directories as required by the Vite/Express setup.

## ▶️ Running the Application

Open two terminal windows. 

**Terminal 1: Start the Backend Server**
\`\`\`bash
cd backend
npm start
# The server will run securely on https://localhost:5000
\`\`\`

**Terminal 2: Start the React Frontend**
\`\`\`bash
cd frontend
npm run dev
# The frontend will run securely on https://localhost:5173
\`\`\`

## 👥 Contributors
*   **Nkosinathi Mabena**
*   **Mampotse Ramonyai**
*   **Matome Mailula**
*   **Kateko Mgabe**
*   
