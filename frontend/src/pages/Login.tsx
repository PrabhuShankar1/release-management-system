import { useState } from "react"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {
  EmailRounded,
  LockRounded,
  RocketLaunchRounded,
  TimelineRounded,
  Visibility,
  VisibilityOff
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await api.post("/login", {
        email,
        password
      })

      login(res.data.user)
      navigate("/tasks")
    } catch (err: any) {
      const backendUrl = `${api.defaults.baseURL || ""}/login`
      const message = err.response?.data?.message
        || (!err.response
          ? `Cannot reach the server right now. Check the backend URL: ${backendUrl}`
          : "Login failed. Please try again.")
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleLogin()
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
        background:
          "radial-gradient(circle at top left, rgba(198,124,78,0.16), transparent 28%), radial-gradient(circle at bottom right, rgba(31,77,71,0.14), transparent 24%), #f4efe7"
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          p: 6
        }}
      >
        <Paper
          sx={{
            p: 4.5,
            borderRadius: 8,
            width: "100%",
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(23,54,49,0.98) 0%, rgba(31,77,71,0.96) 52%, rgba(198,124,78,0.92) 100%)"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 22%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12), transparent 18%)"
            }}
          />
          <Box sx={{ position: "relative" }}>
            <Chip
              label="Release operations"
              sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", mb: 3 }}
            />
            <Typography variant="h4" sx={{ maxWidth: 520 }}>
              Elegant release management starts with a calmer workspace.
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 540, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
              Organize projects, track versions, and coordinate delivery work from a UI that feels more polished and intentional.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            sx={{ position: "relative" }}
          >
            {[
              { title: "Project clarity", icon: <RocketLaunchRounded /> },
              { title: "Release rhythm", icon: <TimelineRounded /> },
              { title: "Team coordination", icon: <LockRounded /> }
            ].map((item) => (
              <Paper
                key={item.title}
                sx={{
                  px: 2.5,
                  py: 2,
                  borderRadius: 5,
                  minWidth: 168,
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "white", width: 36, height: 36 }}>
                    {item.icon}
                  </Avatar>
                  <Typography fontWeight={700}>{item.title}</Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4, lg: 6 }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 470,
            p: { xs: 3, sm: 4.5 },
            borderRadius: 8,
            border: "1px solid rgba(31, 77, 71, 0.08)",
            boxShadow: "0 24px 60px rgba(31, 41, 51, 0.12)",
            background: "linear-gradient(180deg, rgba(255,253,249,0.98) 0%, rgba(255,255,255,0.98) 100%)"
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mb: 2.5,
              bgcolor: "secondary.main",
              color: "white",
              boxShadow: "0 18px 30px rgba(198, 124, 78, 0.28)"
            }}
          >
            <RocketLaunchRounded />
          </Avatar>

          <Typography variant="h5" sx={{ maxWidth: 320 }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Sign in to continue into the refreshed release workspace.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((current) => !current)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="#" underline="hover" sx={{ color: "primary.main" }}>
                  Forgot password?
                </Link>
              </Box>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign in"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Secure access
            </Typography>
          </Divider>

          <Typography color="text.secondary">
            Need help? Contact your administrator for account setup or password recovery.
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
