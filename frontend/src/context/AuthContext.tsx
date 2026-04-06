import { createContext, useContext, useState } from "react"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  )

  const login = (data: any) => {
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)