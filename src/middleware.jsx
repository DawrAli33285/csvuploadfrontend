import React from 'react'
import { Outlet,Navigate } from 'react-router-dom';

const Middleware = () => {
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/" replace />;
  };

export default Middleware;