import React from 'react';
import { Routes, Route } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

import AuthProvider, { RequireAuth } from './AuthProvider';


function App() {
  return (
    <AuthProvider>
      <div className="flex h-screen w-screen">
        <Routes>
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider >
  );
}

export default App;
