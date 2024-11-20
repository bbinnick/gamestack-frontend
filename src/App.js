import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import GameDetails from './pages/GameDetails';
import AdminGameManagement from './pages/AdminGameManagement';
import authService from './services/AuthService';


function App() {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = authService.getUser();
      setUser(decodedUser);
    }
  }, []);

  const handleLogout = (navigate) => {
    if (window.confirm('Are you sure you want to log out?')) {
      authService.removeToken();
      setUser(null);
      console.log(`${user.username} logged out`);
      navigate('/log-in');
    }
  };

  const RequireAuth = ({ children, role }) => {
    if (!user) {
      return <Navigate to="/log-in" />;
    }
    if (role && !user.authorities.includes(role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} handleLogout={handleLogout} />} />
        <Route path="/sign-up" element={<Register setUser={setUser} />} />
        <Route path="/log-in" element={<LogIn setUser={setUser} />} />
        <Route
          path="/backlog"
          element={
            <RequireAuth user={user}>
              <Backlog user={user} />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth role="ROLE_ADMIN" user={user}>
              <AdminGameManagement user={user} />
            </RequireAuth>
          }
        />
        <Route path="/games/:gameId" element={<GameDetails user={user} />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
