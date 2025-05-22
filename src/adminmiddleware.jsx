import React from 'react'
import { Outlet,Navigate } from 'react-router-dom';

const AdminMiddleware = () => {
    const token = localStorage.getItem('adminToken');
    return token ? <Outlet /> : <Navigate to="/admin-login" replace />;
  };

export default AdminMiddleware;