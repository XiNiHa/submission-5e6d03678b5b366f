import { createContext, useContext } from 'react'
import { parse } from 'es-cookie'
import type React from 'react'

interface AuthContextProps {
  accessToken: string | null
}

const AuthContext = createContext<AuthContextProps>({ accessToken: null })

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const cookie = parse(document.cookie)
  const accessToken = cookie.accessToken || null

  return (
    <AuthContext.Provider value={{ accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
