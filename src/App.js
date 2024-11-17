import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';
import GameDetails from './pages/GameDetails';
import AdminGameManagement from './components/AdminGameManagement';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function App() {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;
  
  const RequireAuth = ({ children, role }) => {
      if (!user) {
          return <Navigate to="/log-in" />;
      }
      if (role && user.authorities !== role) {
          return <Navigate to="/" />;
      }
      return children;
  };

  return (
    <BrowserRouter>
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
        <Route path="/games/:gameId" element={<GameDetails />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
