import { Drawer, List, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Typography, Box, Avatar, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AssignmentIcon from "@mui/icons-material/Assignment"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import LogoutIcon from "@mui/icons-material/Logout"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const drawerWidth = 260

const menuItems = [
  { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
  { text: "Releases", path: "/releases", icon: <LocalOfferIcon /> }
]

export default function SidebarLayout({ children }: any) {
  const [open, setOpen] = useState(false)
  const { logout, user } = useAuth()
  const location = useLocation()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.06)"
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(true)} edge="start" sx={{ color: "#1e3a5f" }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalOfferIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#1e3a5f", letterSpacing: 0.5 }}>
              RMS
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                {user.name || user.email}
              </Typography>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
                  fontSize: "0.875rem",
                  fontWeight: 600
                }}
              >
                {user.name ? getInitials(user.name) : user.email?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { 
            width: drawerWidth,
            marginTop: "64px",
            height: "calc(100% - 64px)",
            borderRight: "none",
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
            borderRadius: "0 16px 16px 0",
            background: "white"
          }
        }}
      >
        {/* Navigation */}
        <List sx={{ px: 2, py: 3 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItemButton
                component={Link}
                to={item.path}
                key={item.text}
                onClick={() => setOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  transition: "all 0.2s ease",
                  ...(isActive && {
                    background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
                    boxShadow: "0 4px 12px rgba(30, 58, 95, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2d5a87 0%, #3d7ab5 100%)"
                    }
                  }),
                  "&:hover": {
                    backgroundColor: isActive ? undefined : "rgba(30, 58, 95, 0.06)",
                  }
                }}
              >
                <Box sx={{ mr: 1.5, display: "flex", color: isActive ? "white" : "#666" }}>
                  {item.icon}
                </Box>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.95rem",
                    color: isActive ? "white" : "text.primary"
                  }} 
                />
              </ListItemButton>
            )
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ mx: 2 }} />

        {/* Logout */}
        <List sx={{ px: 2, py: 2 }}>
          <ListItemButton 
            onClick={logout}
            sx={{
              borderRadius: 2,
              py: 1.2,
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)"
              }
            }}
          >
            <Box sx={{ mr: 1.5, display: "flex" }}>
              <LogoutIcon />
            </Box>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem"
              }} 
            />
          </ListItemButton>
        </List>

        {/* Footer */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Release Management v1.0
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
          pt: "80px",
          px: 4,
          pb: 4
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
            minHeight: "calc(100vh - 120px)",
            p: 4
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}

