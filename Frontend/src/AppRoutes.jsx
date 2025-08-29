import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<div style={{padding:'2rem'}}>Home <a href="/register">Register</a></div>} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes