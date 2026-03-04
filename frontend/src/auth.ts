export const login = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const logout = () => {
  localStorage.removeItem("user")
}

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user") || "null")
}

export const getRole = () => {
  const u = getUser()
  return u?.role
}

export const isLoggedIn = () => {
  return !!getUser()
}