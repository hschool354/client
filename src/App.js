// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/pages/Welcome';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import HomePage from './components/pages/HomePage';
import { QueryClient, QueryClientProvider } from 'react-query';

import './index.css';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
    </QueryClientProvider>
  );
}

export default App;