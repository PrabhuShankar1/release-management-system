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
  ArrowBackRounded,
  ArrowForwardRounded,
  DeleteOutlineRounded,
  EditRounded,
  LocalOfferRounded,
  SearchRounded
} from "@mui/icons-material"
import "./Releases.css"

type Release = {
  id: number
  name: string
  version: string
  status: string
  project_id: number
  project_name?: string
}

type Project = {
  id: number
  name: string
}

const statusTone: Record<string, string> = {
  Completed: "#2f855a",
  "In Progress": "#c98633",
  Pending: "#2b6cb0",
  Cancelled: "#c53030"
}

export default function Releases() {
  const [rows, setRows] = useState<Release[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRelease, setEditingRelease] = useState<Release | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    status: "Pending",
    project_id: ""
  })

  const pageSize = 5

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      const [releasesRes, projectsRes] = await Promise.all([
        api.get("/releases"),
        api.get("/projects")
      ])
      setRows(releasesRes.data)
      setProjects(projectsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.name.toLowerCase().includes(search.toLowerCase()) ||
          row.version.toLowerCase().includes(search.toLowerCase()) ||
          (row.project_name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = filteredRows.slice(page * pageSize, page * pageSize + pageSize)

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this release?")) return

    try {
      await api.delete(`/releases/${id}`)
      load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenDialog = (release?: Release) => {
    if (release) {
      setEditingRelease(release)
      setFormData({
        name: release.name,
        version: release.version,
        status: release.status,
        project_id: release.project_id.toString()
      })
    } else {
      setEditingRelease(null)
      setFormData({ name: "", version: "", status: "Pending", project_id: "" })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.version || !formData.project_id) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const payload = {
        name: formData.name,
        version: formData.version,
        status: formData.status,
        project_id: parseInt(formData.project_id, 10)
      }

      if (editingRelease) {
        await api.put(`/releases/${editingRelease.id}`, payload)
      } else {
        await api.post("/releases", payload)
      }

      setDialogOpen(false)
      load()
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
          background: "linear-gradient(135deg, rgba(247,242,237,0.98) 0%, rgba(255,251,246,0.98) 100%)"
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} justifyContent="space-between">
          <Box sx={{ maxWidth: 640 }}>
            <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.16em" }}>
              Release timeline
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Version tracking that looks sharper and reads faster.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
              Releases now sit inside a lighter editorial table with clearer status chips and a calmer data hierarchy.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Paper sx={{ p: 2.5, minWidth: 160, borderRadius: 5, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Total releases
              </Typography>
              <Typography variant="h5" color="primary.main" sx={{ mt: 1 }}>
                {rows.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, minWidth: 160, borderRadius: 5, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Search results
              </Typography>
              <Typography variant="h5" color="secondary.main" sx={{ mt: 1 }}>
                {filteredRows.length}
              </Typography>
            </Paper>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 6 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <TextField
            placeholder="Search releases, versions, or projects"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(0)
            }}
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
            Add release
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ borderRadius: 6, overflow: "hidden" }}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha("#1f4d47", 0.04) }}>
                <TableCell sx={{ fontWeight: 800 }}>Release</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Version</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 8 }}>
                    <Stack spacing={2} alignItems="center">
                      <Avatar sx={{ width: 64, height: 64, bgcolor: alpha("#c67c4e", 0.12), color: "secondary.main" }}>
                        <LocalOfferRounded />
                      </Avatar>
                      <Typography variant="h6">No releases found</Typography>
                      <Typography color="text.secondary">
                        Try another search term or add the next version to your release stream.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((release) => {
                  const tone = statusTone[release.status] || "#52606d"

                  return (
                    <TableRow key={release.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                            <LocalOfferRounded />
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} sx={{ wordBreak: "break-word" }}>
                              {release.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Release #{release.id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={`v${release.version}`} variant="outlined" />
                      </TableCell>
                      <TableCell>{release.project_name || "Unknown project"}</TableCell>
                      <TableCell>
                        <Chip
                          label={release.status}
                          sx={{ bgcolor: alpha(tone, 0.12), color: tone }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" useFlexGap flexWrap="wrap">
                          <Button variant="text" startIcon={<EditRounded />} onClick={() => handleOpenDialog(release)}>
                            Edit
                          </Button>
                          <Button color="error" variant="text" startIcon={<DeleteOutlineRounded />} onClick={() => handleDelete(release.id)}>
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            sx={{ p: 2.5 }}
          >
            <Typography color="text.secondary">
              Page {Math.min(page + 1, totalPages)} of {totalPages} ({filteredRows.length} matching releases)
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<ArrowBackRounded />}
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardRounded />}
                onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRelease ? "Edit release" : "Add a new release"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Release name"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              fullWidth
            />
            <TextField
              label="Version"
              value={formData.version}
              onChange={(event) => setFormData({ ...formData, version: event.target.value })}
              fullWidth
              placeholder="e.g. 2.4.0"
            />
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.project_id}
                label="Project"
                onChange={(event) => setFormData({ ...formData, project_id: event.target.value })}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(event) => setFormData({ ...formData, status: event.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editingRelease ? "Update release" : "Create release"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
