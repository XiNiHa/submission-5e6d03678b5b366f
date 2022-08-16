import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type React from 'react'
import { AuthProvider } from '@/auth'
import { ApiProvider } from '@/api'
import Login from '@/pages/Login'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  )
}

export default App
