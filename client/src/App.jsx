import React, { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser } = useContext(AuthContext)
  const location = useLocation(); // ✅ Hook for reactive path detection

  const getBgClass = () => {
    if (location.pathname === '/login') return "bg-[url('./src/assets/bg-login.png')] bg-cover";
    return "bg-[url('./src/assets/bg.png')] bg-cover";
  };

  return (
    <div className={`${getBgClass()} min-h-screen transition-all duration-300`}>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
