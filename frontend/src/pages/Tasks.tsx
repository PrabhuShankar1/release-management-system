import { useEffect, useMemo, useState } from "react"
import { alpha } from "@mui/material/styles"
import axios from "axios"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {
  AddRounded,
  AssignmentRounded,
  CheckCircleRounded,
  DeleteOutlineRounded,
  SearchRounded
} from "@mui/icons-material"
import "./Tasks.css"

type Task = {
  id: number
  title: string
  status: string
  release_id: number
}

type Release = {
  id: number
  name: string
  version: string
}

const API_TASKS = "http://127.0.0.1:5000/api/tasks"
const API_RELEASES = "http://127.0.0.1:5000/api/releases"

const statusTone: Record<string, string> = {
  Done: "#2f855a",
  "In Progress": "#c98633",
  Open: "#2b6cb0"
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [releaseId, setReleaseId] = useState<number | "">("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksRes, releasesRes] = await Promise.all([
        axios.get(API_TASKS),
        axios.get(API_RELEASES)
      ])
      setTasks(tasksRes.data)
      setReleases(releasesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!title.trim() || !releaseId) return

    try {
      await axios.post(API_TASKS, { title, release_id: releaseId })
      setTitle("")
      setReleaseId("")
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const markDone = async (id: number) => {
    try {
      await axios.put(`${API_TASKS}/${id}`, { status: "Done" })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await axios.delete(`${API_TASKS}/${id}`)
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) &&
          (statusFilter === "All" || task.status === statusFilter)
      ),
    [tasks, search, statusFilter]
  )

  const getReleaseName = (id: number) => {
    const release = releases.find((item) => item.id === id)
    return release ? `${release.name} (v${release.version})` : "Unknown release"
  }

  const totalDone = tasks.filter((task) => task.status === "Done").length
  const totalOpen = tasks.filter((task) => task.status === "Open").length
  const totalProgress = tasks.filter((task) => task.status === "In Progress").length

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 7,
          background: "linear-gradient(135deg, rgba(237,245,244,0.96) 0%, rgba(244,248,247,0.98) 100%)"
        }}
      >
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} justifyContent="space-between">
          <Box sx={{ maxWidth: 640 }}>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: "0.16em" }}>
              Task coordination
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Work planning that feels lighter, calmer, and easier to scan.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.7 }}>
              The task page now separates capture, filtering, and execution status so day-to-day operations feel much more deliberate.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {[
              { label: "Open", value: totalOpen, color: "#2b6cb0" },
              { label: "In progress", value: totalProgress, color: "#c98633" },
              { label: "Done", value: totalDone, color: "#2f855a" }
            ].map((item) => (
              <Paper key={item.label} sx={{ p: 2.5, minWidth: 150, borderRadius: 5, display: "grid", alignContent: "start" }}>
                <Typography color="text.secondary" fontWeight={700}>
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, color: item.color }}>
                  {item.value}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xl: "360px minmax(0, 1fr)" }
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 6 }}>
          <Typography variant="h6">Add new task</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
            Capture the work item and link it to the release it supports.
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentRounded color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl>
              <InputLabel>Release</InputLabel>
              <Select
                value={releaseId}
                label="Release"
                onChange={(event) => setReleaseId(event.target.value as number)}
              >
                <MenuItem value="">Select release</MenuItem>
                {releases.map((release) => (
                  <MenuItem key={release.id} value={release.id}>
                    {release.name} (v{release.version})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              disabled={!title.trim() || !releaseId}
              onClick={addTask}
            >
              Add task
            </Button>
          </Stack>
        </Paper>

        <Stack spacing={3}>
          <Paper sx={{ p: 2.5, borderRadius: 6 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                placeholder="Search tasks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <FormControl sx={{ minWidth: { xs: "100%", md: 180 } }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
              <CircularProgress />
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Paper
              sx={{
                p: 6,
                borderRadius: 6,
                textAlign: "center",
                border: "1px dashed rgba(31, 77, 71, 0.18)"
              }}
            >
              <Avatar sx={{ mx: "auto", mb: 2, width: 64, height: 64, bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                <AssignmentRounded />
              </Avatar>
              <Typography variant="h6">No tasks found</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Adjust the filters or create the first task tied to an upcoming release.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {filteredTasks.map((task) => {
                const tone = statusTone[task.status] || "#52606d"

                return (
                  <Card key={task.id}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha(tone, 0.12), color: tone }}>
                              <AssignmentRounded />
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                                {task.title}
                              </Typography>
                              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                                Linked release: {getReleaseName(task.release_id)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                          justifyContent={{ xs: "flex-start", md: "flex-end" }}
                          useFlexGap
                          flexWrap="wrap"
                        >
                          <Chip
                            label={task.status}
                            sx={{ bgcolor: alpha(tone, 0.12), color: tone }}
                          />
                          <Button
                            color="success"
                            variant="outlined"
                            startIcon={<CheckCircleRounded />}
                            onClick={() => markDone(task.id)}
                            disabled={task.status === "Done"}
                          >
                            Mark done
                          </Button>
                          <Button
                            color="error"
                            variant="text"
                            startIcon={<DeleteOutlineRounded />}
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
