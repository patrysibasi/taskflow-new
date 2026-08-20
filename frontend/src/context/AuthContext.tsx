import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"

import type { ReactNode } from "react"

import type { User } from "../types/user"

import {
  login as loginUser,
  getCurrentUser,
  logout as logoutUser
} from "../services/authService"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (
    email: string,
    password: string
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()

        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(
    email: string,
    password: string
  ) {
    await loginUser(email, password)

    const currentUser = await getCurrentUser()

    setUser(currentUser)
  }

  function logout() {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth musi być używany wewnątrz AuthProvider"
    )
  }

  return context
}
