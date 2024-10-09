import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Blog from './pages/Blog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/log-in" element={<LogIn />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
