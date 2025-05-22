import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter , Route ,Routes} from 'react-router-dom'
import Register from './register';
import Dashboard from './dashboard';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './adminDashboard';
import AdminLogin from './adminLogin';
import FileCodePage from './fileCode';
import Middleware from './middleware';
import AdminMiddleware from './adminmiddleware';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/dashboard' element={<Middleware />}>
  <Route index element={<Dashboard />} />
</Route>

<Route path='/admindashboard' element={<AdminMiddleware />}>
  <Route index element={<AdminDashboard />} />
</Route>
      <Route path='/admin-login' element={<AdminLogin></AdminLogin>}></Route>
      <Route path="/paidfileaccess/:id/:code" element={<FileCodePage />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
