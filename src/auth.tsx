import { createContext, useContext, useState } from 'react'
import * as Cookie from 'es-cookie'
import type React from 'react'

interface AuthContextProps {
  accessToken: string | null
  update: (accessToken: string) => void
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  update: () => void 0,
})

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState(
    Cookie.parse(document.cookie).accessToken || null
  )

  const update = (token: string) => {
    document.cookie = Cookie.encode('accessToken', token, {
      secure: true,
      sameSite: 'strict',
      expires: 1, // d
    })
    setAccessToken(token)
  }

  return (
    <AuthContext.Provider value={{ accessToken, update }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
