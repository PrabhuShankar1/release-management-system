import { useMemo, useState } from "react"
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom"
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from "@mui/material"
import {
  DashboardRounded,
  GroupsRounded,
  FolderRounded,
  RocketLaunchRounded,
  AssignmentTurnedInRounded,
  LogoutRounded,
  MenuRounded,
  PersonRounded,
  ShieldRounded,
  TrendingUpRounded
} from "@mui/icons-material"

import Login from "./pages/Login"
import Releases from "./pages/Releases"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Projects from "./pages/Projects"
import Users from "./pages/Users"
import RoleProtectedRoute from "./ProtectedRoute"
import { logout, getRole, isLoggedIn, getUser } from "./auth"

const drawerWidth = 300
const navIconSx = { fontSize: 22 }

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    roles: ["Admin"],
    icon: <DashboardRounded sx={navIconSx} />
  },
  {
    text: "Users",
    path: "/users",
    roles: ["Admin"],
    icon: <GroupsRounded sx={navIconSx} />
  },
  {
    text: "Projects",
    path: "/projects",
    roles: ["Admin", "Manager"],
    icon: <FolderRounded sx={navIconSx} />
  },
  {
    text: "Releases",
    path: "/releases",
    roles: ["Admin", "Manager"],
    icon: <RocketLaunchRounded sx={navIconSx} />
  },
  {
    text: "Tasks",
    path: "/tasks",
    roles: ["Admin", "Manager", "Worker"],
    icon: <AssignmentTurnedInRounded sx={navIconSx} />
  }
]

const pageMeta: Record<string, { eyebrow: string; subtitle: string }> = {
  "/dashboard": {
    eyebrow: "Command center",
    subtitle: "Track delivery health, release volume, and execution momentum in one place."
  },
  "/users": {
    eyebrow: "Team access",
    subtitle: "Manage who can enter the workspace and how responsibilities are distributed."
  },
  "/projects": {
    eyebrow: "Portfolio",
    subtitle: "Shape the project slate with clear descriptions, quick search, and faster curation."
  },
  "/releases": {
    eyebrow: "Ship rhythm",
    subtitle: "Keep versions organized, status-driven, and easy to scan across teams."
  },
  "/tasks": {
    eyebrow: "Execution board",
    subtitle: "Move work forward with sharper filtering, cleaner status tracking, and better focus."
  }
}

function ShellNavigation({
  pathname,
  items,
  onNavigate
}: {
  pathname: string
  items: typeof menuItems
  onNavigate?: () => void
}) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, rgba(23, 54, 49, 0.97) 0%, rgba(19, 43, 39, 0.98) 100%)",
        color: "common.white",
        p: 2
      }}
    >
      <Box
        sx={{
          p: 2.25,
          borderRadius: 5,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Stack direction="row" spacing={1.75} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3.5,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg, rgba(198, 124, 78, 1) 0%, rgba(224, 164, 108, 1) 100%)",
              boxShadow: "0 16px 30px rgba(198, 124, 78, 0.28)"
            }}
          >
            <RocketLaunchRounded />
          </Box>
          <Box>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.16em" }}>
              Release Suite
            </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1.15 }}>
              RMS Workspace
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
          A warmer, cleaner command surface for projects, releases, and day-to-day delivery flow.
        </Typography>
      </Box>

      <Typography
        variant="overline"
        sx={{ mt: 3, mb: 1.5, px: 1, color: "rgba(255,255,255,0.62)", letterSpacing: "0.16em" }}
      >
        Navigation
      </Typography>

      <List sx={{ p: 0, display: "grid", gap: 1 }}>
        {items.map((item) => {
          const selected = pathname === item.path

          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path)
                onNavigate?.()
              }}
              sx={{
                borderRadius: 4,
                px: 1.5,
                py: 1.35,
                color: selected ? "#173631" : "rgba(255,255,255,0.82)",
                background: selected
                  ? "linear-gradient(135deg, #f6e8d8 0%, #fffaf4 100%)"
                  : "transparent",
                boxShadow: selected ? "0 14px 28px rgba(0, 0, 0, 0.16)" : "none",
                "&:hover": {
                  background: selected
                    ? "linear-gradient(135deg, #f6e8d8 0%, #fffaf4 100%)"
                    : "rgba(255,255,255,0.08)"
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 700, fontSize: "0.96rem" }}
              />
            </ListItemButton>
          )
        })}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderRadius: 5,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: alpha("#fff", 0.16), color: "white" }}>
            <TrendingUpRounded fontSize="small" />
          </Avatar>
          <Box>
            <Typography fontWeight={700}>Steady delivery</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)" }}>
              Keep releases elegant and easy to manage.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

function AppLayout() {
  const location = useLocation()
  const role = getRole()
  const user = getUser()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const filteredMenuItems = useMemo(
    () => menuItems.filter((item) => item.roles.includes(role || "")),
    [role]
  )

  const currentMeta = pageMeta[location.pathname] ?? pageMeta["/tasks"]

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate("/login", { replace: true })
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" />
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            background: "transparent"
          }
        }}
        open
      >
        <ShellNavigation pathname={location.pathname} items={filteredMenuItems} />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            border: "none",
            background: "transparent"
          }
        }}
      >
        <ShellNavigation
          pathname={location.pathname}
          items={filteredMenuItems}
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            minHeight: "100%",
            borderRadius: { xs: 4, md: 7 },
            overflow: "hidden",
            border: "1px solid rgba(31, 77, 71, 0.08)",
            boxShadow: "0 30px 80px rgba(31, 41, 51, 0.12)",
            background: "linear-gradient(180deg, rgba(255,253,249,0.96) 0%, rgba(255,255,255,0.96) 100%)",
            backdropFilter: "blur(18px)"
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 2, md: 3 },
              borderBottom: "1px solid rgba(31, 77, 71, 0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(249,244,236,0.8) 100%)"
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                minHeight: "unset !important",
                gap: 2,
                alignItems: { xs: "flex-start", sm: "center" },
                flexWrap: { xs: "wrap", sm: "nowrap" }
              }}
            >
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  border: "1px solid rgba(31, 77, 71, 0.12)"
                }}
              >
                <MenuRounded />
              </IconButton>

              <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 0 }, order: { xs: 2, sm: 1 } }}>
                <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.16em" }}>
                  {currentMeta.eyebrow}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.3, pr: { md: 2 } }}>
                  {filteredMenuItems.find((item) => item.path === location.pathname)?.text ?? "Workspace"}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 0.8 }}>
                  {currentMeta.subtitle}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ order: { xs: 1, sm: 2 }, ml: { xs: "auto", sm: 0 } }}
              >
                <Chip
                  icon={<ShieldRounded />}
                  label={user?.role || "Member"}
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    bgcolor: alpha("#1f4d47", 0.08),
                    color: "primary.main"
                  }}
                />
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "secondary.main",
                      color: "#fff7ef",
                      fontWeight: 800
                    }}
                  >
                    {user?.name?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
              </Stack>
            </Toolbar>
          </Box>

          <Box
            component="main"
            sx={{
              p: { xs: 2, md: 4 },
              background:
                "radial-gradient(circle at top right, rgba(198,124,78,0.12), transparent 24%), radial-gradient(circle at top left, rgba(31,77,71,0.08), transparent 20%)"
            }}
          >
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <RoleProtectedRoute roles={["Admin"]}>
                    <Dashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <RoleProtectedRoute roles={["Admin"]}>
                    <Users />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <RoleProtectedRoute roles={["Admin", "Manager"]}>
                    <Projects />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/releases"
                element={
                  <RoleProtectedRoute roles={["Admin", "Manager"]}>
                    <Releases />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <RoleProtectedRoute roles={["Admin", "Manager", "Worker"]}>
                    <Tasks />
                  </RoleProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to={filteredMenuItems[0]?.path || "/tasks"} />} />
            </Routes>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 4,
            border: "1px solid rgba(31, 77, 71, 0.08)",
            boxShadow: "0 24px 60px rgba(31, 41, 51, 0.14)"
          }
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
              <PersonRounded fontSize="small" />
            </Avatar>
            <Box>
              <Typography fontWeight={700}>{user?.name || "Workspace User"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role || "Member"}
              </Typography>
            </Box>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            navigate(filteredMenuItems[0]?.path || "/tasks")
          }}
        >
          <ListItemIcon>
            <DashboardRounded fontSize="small" />
          </ListItemIcon>
          Workspace home
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </HashRouter>
  )
}

export default App
