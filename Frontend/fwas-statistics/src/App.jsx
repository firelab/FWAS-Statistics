import React from 'react';
import './App.css'
import NavBar from './components/NavBar.jsx'
import Users from './Views/Users.jsx';
import Alerts from './Views/Alerts.jsx'
import Home from './Views/Home.jsx';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      
      <div className="body1">
        <Router>
          <NavBar />
          <Routes>
            <Route path={import.meta.env.VITE_ENDPOINT} element={<Home />} />
            <Route path={import.meta.env.VITE_ENDPOINT+"users"} element={<Users />} />
            <Route path={import.meta.env.VITE_ENDPOINT+"alerts"} element={<Alerts />} />
          </Routes>
        </Router>
      </div>
    </LocalizationProvider>
  );
}

export default App
