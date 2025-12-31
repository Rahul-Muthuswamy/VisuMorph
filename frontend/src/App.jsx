import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import RecordingPage from './pages/RecordingPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recording" element={<RecordingPage />} />
        {/* Redirect unknown routes to home instead of blank page */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App

