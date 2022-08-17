import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type React from 'react'
import { AuthProvider } from '@/auth'
import { ApiProvider } from '@/api'
import Loader from '@/components/Loader'
import Login from '@/pages/Login'
import Me from '@/pages/Me'
import Reset from '@/pages/Reset'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Me />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset" element={<Reset />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  )
}

export default App
