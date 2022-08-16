import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type React from 'react'
import { AuthProvider } from '@/auth'
import { ApiProvider } from '@/api'
import Login from '@/pages/Login'
import Me from '@/pages/Me'
import Loader from '@/components/Loader'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/me" element={<Me />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  )
}

export default App
