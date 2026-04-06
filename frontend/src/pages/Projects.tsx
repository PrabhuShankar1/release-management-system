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
  DeleteOutlineRounded,
  DescriptionRounded,
  EditRounded,
  FolderRounded,
  SearchRounded
} from "@mui/icons-material"
import "./Projects.css"

type Project = {
  id: number
  name: string
  description: string
}

const API = "http://127.0.0.1:5000/api/projects"

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

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

  useEffect(() => {
    loadProjects()
  }, [])

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
            <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.16em" }}>
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
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 160, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Total projects
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
                {projects.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 160, display: "grid", alignContent: "start" }}>
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

      <Paper sx={{ p: 2.5, borderRadius: 6 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
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
            <Card key={project.id}>
              <CardContent sx={{ p: 3.25 }}>
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

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
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
