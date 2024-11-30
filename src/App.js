import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import GameDetails from './pages/GameDetails';
import AdminGameManagement from './pages/AdminGameManagement';
import { UserProvider, useUser } from './contexts/UserContext';

function App() {
  const RequireAuth = ({ children, role }) => {
    const { user } = useUser();
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
      <UserProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route
            path="/backlog"
            element={
              <RequireAuth>
                <Backlog />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth role="ROLE_ADMIN">
                <AdminGameManagement />
              </RequireAuth>
            }
          />
          <Route path="/games/local/:gameId" element={<GameDetails />} />
          <Route path="/games/igdb/:igdbGameId" element={<GameDetails />} />
          {/* Other routes */}
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
