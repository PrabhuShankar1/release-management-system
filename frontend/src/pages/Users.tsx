import { useEffect, useMemo, useState } from "react"
import { alpha } from "@mui/material/styles"
import { api } from "../api"
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
  BadgeRounded,
  DeleteOutlineRounded,
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
  title: string
}

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
      const response = await api.get("/users")
      setUsers(response.data)
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
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase()) ||
          user.title.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  )

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await api.post("/register", formData)
      setDialogOpen(false)
      setFormData({ name: "", email: "", password: "", role: "Worker" })
      loadUsers()
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to register user")
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Remove ${user.name} from the system?`)) return

    try {
      await api.delete(`/users/${user.id}`)
      loadUsers()
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove user")
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

  const managers = users.filter((user) => user.role === "Manager").length
  const workers = users.filter((user) => user.role === "Worker").length

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
          <Box sx={{ maxWidth: 660 }}>
            <Typography variant="overline" color="primary.main">
              Team directory
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              View every stored member with their role title.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2 }}>
              The admin page now loads real members from the database and shows workers, managers, and admins clearly in one list.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 170, minHeight: 126, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Total members
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
                {users.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 170, minHeight: 126, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Managers / Workers
              </Typography>
              <Typography variant="h5" color="secondary.main" sx={{ mt: 1 }}>
                {managers} / {workers}
              </Typography>
            </Paper>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 102, display: "flex", alignItems: "center" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" sx={{ width: "100%" }}>
          <TextField
            placeholder="Search members, role, or title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: { xs: "100%", md: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded color="action" />
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => setDialogOpen(true)}>
            Add member
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: 6, overflow: "hidden" }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha("#1f4d47", 0.04) }}>
              <TableCell sx={{ fontWeight: 800 }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 8 }}>
                  <Stack alignItems="center">
                    <CircularProgress />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 8 }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ width: 60, height: 60, bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                      <GroupRounded />
                    </Avatar>
                    <Typography variant="h6">No members found</Typography>
                    <Typography color="text.secondary" textAlign="center">
                      Add a member or search with a different name, role, or title.
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
                        <Avatar sx={{ bgcolor: alpha(tone, 0.12), color: tone, width: 42, height: 42 }}>
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
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BadgeRounded sx={{ color: "secondary.main", fontSize: 18 }} />
                        <Typography>{user.title}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        color="error"
                        variant="text"
                        startIcon={<DeleteOutlineRounded />}
                        onClick={() => handleDelete(user)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register a new member</DialogTitle>
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
            Register member
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
