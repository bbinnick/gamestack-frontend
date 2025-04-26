---

# 📂 `GameStack-Frontend` — README.md

This is the React frontend for the **GameStack** application — a personal game backlog manager.  
Built with React, Material UI (MUI), Axios, and React Router.

## 📋 Features

- User registration and login
- JWT authentication and token handling
- View and manage your personal game backlog
- Add games with status and personal rating
- Dynamic light/dark theme switching
- Admin dashboard for managing master game list (Admin users only)

## 🛠 Technologies Used

- React 18+
- Material UI (MUI)
- Axios
- React Router DOM
- Context API for global auth and theme management

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### 2. Setup Instructions

#### Clone the repository

    git clone https://github.com/your-username/GameStack-Frontend.git
    cd GameStack-Frontend

#### Install dependencies
    npm install

or

    yarn install

---

### 3. Configure Environment Variables

#### Create a `.env` file in the root of the project:

    REACT_APP_API_URL=http://localhost:8080/api

Make sure this matches the backend server URL!

### 4. Running the Application

#### Start the development server:

    npm start

or

    yarn start

The app will run at:

    http://localhost:3000/

---

### 🔥 Important Notes
- Ensure the backend is running first to interact with APIs.

- JWT tokens are stored in localStorage for session management.

- Only users with the ADMIN role will be able to access admin routes.

- The project uses Material UI's ThemeProvider for dynamic light/dark mode.

----------------------


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
