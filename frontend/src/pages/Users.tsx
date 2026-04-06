import { useEffect, useMemo, useState } from "react"
import { alpha } from "@mui/material/styles"
import axios from "axios"
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material"
import {
  AddRounded,
  AdminPanelSettingsRounded,
  GroupRounded,
  HowToRegRounded,
  MailOutlineRounded,
  PersonOutlineRounded,
  SearchRounded
} from "@mui/icons-material"

type User = {
  id: number
  name: string
  email: string
  role: string
}

const API = "http://127.0.0.1:5000/api"

const roleTone: Record<string, string> = {
  Admin: "#c53030",
  Manager: "#c98633",
  Worker: "#2b6cb0"
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Worker"
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setUsers([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  )

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role
      })
    } else {
      setEditingUser(null)
      setFormData({ name: "", email: "", password: "", role: "Worker" })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await axios.post(`${API}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      setDialogOpen(false)
      alert("User registered successfully!")
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to register user"
      alert(message)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <AdminPanelSettingsRounded fontSize="small" />
      case "Manager":
        return <HowToRegRounded fontSize="small" />
      default:
        return <PersonOutlineRounded fontSize="small" />
    }
  }

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 7,
          background: "linear-gradient(135deg, rgba(238,243,250,0.98) 0%, rgba(250,252,255,0.98) 100%)"
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} justifyContent="space-between">
          <Box sx={{ maxWidth: 640 }}>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em" }}>
              People and roles
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              User management with a more welcoming administrative feel.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
              This page is styled to feel less bare while keeping the current backend constraints intact.
            </Typography>
          </Box>

          <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 180, display: "grid", alignContent: "start" }}>
            <Typography color="text.secondary" fontWeight={700}>
              Directory size
            </Typography>
            <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
              {users.length}
            </Typography>
          </Paper>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 6 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <TextField
            placeholder="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: { xs: "100%", md: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded color="action" />
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpenDialog()}>
            Add user
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 6, overflow: "hidden" }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha("#1f4d47", 0.04) }}>
              <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 8 }}>
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 8 }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ width: 64, height: 64, bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                      <GroupRounded />
                    </Avatar>
                    <Typography variant="h6">No users found</Typography>
                    <Typography color="text.secondary" textAlign="center">
                      The current UI can register users, but this backend does not yet provide a user list endpoint to display existing accounts.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const tone = roleTone[user.role] || "#52606d"

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: alpha(tone, 0.12), color: tone }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={700} sx={{ wordBreak: "break-word" }}>
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ wordBreak: "break-word" }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        sx={{ bgcolor: alpha(tone, 0.12), color: tone }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? "Edit user" : "Register a new user"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full name"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRounded color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRounded color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              fullWidth
              helperText={editingUser ? "Leave blank to keep the current password." : ""}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Worker">Worker</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editingUser ? "Update user" : "Register user"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
