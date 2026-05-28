/**
 * App.jsx
 * Root component with React Router configuration.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import BisectionPage from './pages/BisectionPage';
import NewtonPage from './pages/NewtonPage';
import SecantPage from './pages/SecantPage';
import FixedPointPage from './pages/FixedPointPage';
import LagrangePage from './pages/LagrangePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bisection" element={<BisectionPage />} />
          <Route path="/newton" element={<NewtonPage />} />
          <Route path="/secant" element={<SecantPage />} />
          <Route path="/fixed-point" element={<FixedPointPage />} />
          <Route path="/lagrange" element={<LagrangePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
