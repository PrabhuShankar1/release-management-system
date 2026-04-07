import { useEffect, useMemo, useState } from "react"
import { alpha } from "@mui/material/styles"
import axios from "axios"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {
  AddRounded,
  CheckCircleRounded,
  DeleteOutlineRounded,
  DescriptionRounded,
  EditRounded,
  FolderRounded,
  Inventory2Rounded,
  SearchRounded
} from "@mui/icons-material"
import { api } from "../api"
import { getUser } from "../auth"
import "./Projects.css"

type Project = {
  id: number
  name: string
  description: string
}

type ApprovedRequest = {
  id: number
  product?: string | null
  quantity?: number | null
  reason?: string | null
  requested_by?: number | null
  reviewed_at?: string | null
}

const API = "http://127.0.0.1:5000/api/projects"

const formatDateTime = (value?: string | null) => {
  if (!value) return "No approval time"
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

function ManagerApprovedRequests() {
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadApprovedRequests()
  }, [])

  const loadApprovedRequests = async () => {
    try {
      setLoading(true)
      const response = await api.get("/tasks", { params: { status: "Approved" } })
      setApprovedRequests(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = useMemo(
    () =>
      approvedRequests.filter((request) =>
        `${request.product || ""} ${request.reason || ""} ${request.requested_by || ""} ${request.quantity || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [approvedRequests, search]
  )

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 7,
          background: "linear-gradient(135deg, rgba(255,248,240,0.96) 0%, rgba(246,232,216,0.96) 100%)"
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="overline" color="secondary.main">
              Approved requests
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Only approved worker requests are shown here.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
              The manager project page now shows only approved requests, including worker user IDs, quantity, reason, and approval time.
            </Typography>
          </Box>

          <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 180, minHeight: 126, display: "grid", alignContent: "start" }}>
            <Typography color="text.secondary" fontWeight={700}>
              Approved requests
            </Typography>
            <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
              {approvedRequests.length}
            </Typography>
          </Paper>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 102, display: "flex", alignItems: "center" }}>
        <TextField
          placeholder="Search approved requests"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: "100%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded color="action" />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            borderRadius: 6,
            textAlign: "center",
            border: "1px dashed rgba(31, 77, 71, 0.18)"
          }}
        >
          <Avatar sx={{ mx: "auto", mb: 2, width: 60, height: 60, bgcolor: alpha("#2f855a", 0.1), color: "#2f855a" }}>
            <CheckCircleRounded />
          </Avatar>
          <Typography variant="h6">No approved requests found</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Approved worker requests will appear here after manager approval.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {filteredRequests.map((request) => (
            <Paper key={request.id} sx={{ p: 3, borderRadius: 6 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha("#2f855a", 0.12), color: "#2f855a", width: 42, height: 42 }}>
                      <Inventory2Rounded />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                        {request.product || "Unnamed product"}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                        {request.reason || "No reason provided"}
                      </Typography>
                      <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {request.quantity || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Worker user ID: {request.requested_by ?? "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Approved on: {formatDateTime(request.reviewed_at)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Button variant="text" color="success" startIcon={<CheckCircleRounded />}>
                  Approved
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default function Projects() {
  const user = getUser()
  const isManager = user?.role === "Manager"

  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!isManager) {
      loadProjects()
    }
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API)
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.name.toLowerCase().includes(search.toLowerCase()) ||
          project.description.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  )

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setName(project.name)
      setDescription(project.description)
    } else {
      setEditingProject(null)
      setName("")
      setDescription("")
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Project name required")
      return
    }

    try {
      if (editingProject) {
        await axios.put(`${API}/${editingProject.id}`, { name, description })
      } else {
        await axios.post(API, { name, description })
      }

      setDialogOpen(false)
      setEditingProject(null)
      setName("")
      setDescription("")
      loadProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return

    try {
      await axios.delete(`${API}/${id}`)
      loadProjects()
    } catch (err) {
      console.error(err)
    }
  }

  if (isManager) {
    return <ManagerApprovedRequests />
  }

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 7,
          background: "linear-gradient(135deg, rgba(255,248,240,0.96) 0%, rgba(246,232,216,0.96) 100%)"
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
          <Box sx={{ maxWidth: 620 }}>
            <Typography variant="overline" color="secondary.main">
              Project curation
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              A cleaner portfolio view for the work your team is shaping.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
              Search, edit, and create projects in a card layout that feels more like a product workspace than a utility page.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 160, minHeight: 126, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Total projects
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
                {projects.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 160, minHeight: 126, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Matching search
              </Typography>
              <Typography variant="h5" color="secondary.main" sx={{ mt: 1 }}>
                {filteredProjects.length}
              </Typography>
            </Paper>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 102, display: "flex", alignItems: "center" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" sx={{ width: "100%" }}>
          <TextField
            placeholder="Search by name or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: { xs: "100%", md: 360 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded color="action" />
                </InputAdornment>
              )
            }}
          />
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpenDialog()}>
            Add project
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            borderRadius: 6,
            textAlign: "center",
            border: "1px dashed rgba(31, 77, 71, 0.18)"
          }}
        >
          <Avatar sx={{ mx: "auto", mb: 2, width: 64, height: 64, bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
            <FolderRounded />
          </Avatar>
          <Typography variant="h6">No projects found</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try a different search term or create a new project to start building out the portfolio.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))"
            }
          }}
        >
          {filteredProjects.map((project) => (
            <Card key={project.id} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3.25, height: "100%", display: "flex", flexDirection: "column" }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                        <FolderRounded />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" noWrap>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Project #{project.id}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7, minHeight: 82 }}>
                      {project.description || "No description yet. Add one to clarify the scope and ownership of this project."}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DescriptionRounded sx={{ color: "secondary.main", fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                      Portfolio item
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => handleOpenDialog(project)}>
                      <EditRounded />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteProject(project.id)}>
                      <DeleteOutlineRounded />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? "Edit project" : "Add a new project"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Project name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderRounded color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Describe goals, scope, or ownership"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editingProject ? "Update project" : "Create project"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
