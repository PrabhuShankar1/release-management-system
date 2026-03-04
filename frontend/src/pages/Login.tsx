import { useState } from "react"
import {
  TextField,
  Button,
  Container,
  Box,
  Paper,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  Avatar,
  Fade
} from "@mui/material"

import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Google as GoogleIcon
} from "@mui/icons-material"

import { styled } from "@mui/material/styles"
import { api } from "../api"
import { login } from "../auth"
import { useNavigate } from "react-router-dom"


/* ===============================
   Styles
================================ */
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: 16,
  backdropFilter: "blur(10px)",
  background: "rgba(255,255,255,0.95)"
}))

const GradientButton = styled(Button)({
  background: "linear-gradient(90deg,#667eea,#764ba2)",
  borderRadius: 12,
  fontWeight: 600,
  textTransform: "none"
})


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const nav = useNavigate()


  /* ===============================
     NORMAL LOGIN
  ================================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/login", { email, password })

      login(res.data.user)

      setSuccess(true)
      setTimeout(() => nav("/"), 1000)

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }


  /* ===============================
     GOOGLE LOGIN  ⭐ ADDED BACK
  ================================= */
  const handleGoogleLogin = () => {
    // redirect to Flask OAuth route
    window.location.href = "http://127.0.0.1:5000/auth/google"
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#667eea,#764ba2)"
      }}
    >
      <Container maxWidth="sm">
        <Fade in>
          <StyledPaper>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#667eea", width: 60, height: 60 }}>
                <LoginIcon />
              </Avatar>
            </Box>

            <Typography variant="h5" align="center" mb={3}>
              Sign In
            </Typography>

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >

              {/* Email */}
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  )
                }}
              />

              {/* Password */}
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />

              <GradientButton type="submit" disabled={loading}>
                {loading ? "Signing..." : "Login"}
              </GradientButton>

              <Divider sx={{ my: 2 }}>OR</Divider>

              {/* ⭐ GOOGLE BUTTON */}
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                Sign in with Google
              </Button>

            </Box>
          </StyledPaper>
        </Fade>
      </Container>

      <Snackbar open={success} autoHideDuration={1500}>
        <Alert severity="success">Login successful!</Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  )
}