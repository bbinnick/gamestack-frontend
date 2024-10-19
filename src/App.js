import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import Backlog from './pages/Backlog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/backlog" element={<Backlog />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
