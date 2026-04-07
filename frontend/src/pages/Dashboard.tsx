import { useEffect, useState } from "react"
import { alpha } from "@mui/material/styles"
import { api } from "../api"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material"
import {
  Assignment,
  CheckCircleRounded,
  FolderRounded,
  LocalOfferRounded,
  PendingActionsRounded,
  RadarRounded,
  ScheduleRounded,
  TrendingUpRounded
} from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

type Stats = {
  projects: number
  releases: number
  tasks: number
  doneTasks: number
  pendingTasks: number
  inProgressTasks: number
}

const chartColors = ["#2f855a", "#c98633", "#2b6cb0"]

const Grid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gap: 3,
      gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" }
    }}
  >
    {children}
  </Box>
)

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    releases: 0,
    tasks: 0,
    doneTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projectsRes, releasesRes, tasksRes] = await Promise.all([
        api.get("/projects"),
        api.get("/releases"),
        api.get("/tasks")
      ])

      const tasks = tasksRes.data
      const doneTasks = tasks.filter((task: any) => task.status === "Done").length
      const pendingTasks = tasks.filter((task: any) => task.status === "Open").length
      const inProgressTasks = tasks.filter((task: any) => task.status === "In Progress").length

      setStats({
        projects: projectsRes.data.length,
        releases: releasesRes.data.length,
        tasks: tasks.length,
        doneTasks,
        pendingTasks,
        inProgressTasks
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const completionRate = stats.tasks > 0 ? Math.round((stats.doneTasks / stats.tasks) * 100) : 0
  const barData = [
    { name: "Projects", value: stats.projects },
    { name: "Releases", value: stats.releases },
    { name: "Tasks", value: stats.tasks }
  ]
  const pieData = [
    { name: "Done", value: stats.doneTasks },
    { name: "In Progress", value: stats.inProgressTasks },
    { name: "Open", value: stats.pendingTasks }
  ]

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      detail: "Portfolio in motion",
      icon: <FolderRounded />,
      color: "#1f4d47"
    },
    {
      title: "Releases",
      value: stats.releases,
      detail: "Versions on the runway",
      icon: <LocalOfferRounded />,
      color: "#c67c4e"
    },
    {
      title: "Tasks",
      value: stats.tasks,
      detail: "Work items across teams",
      icon: <Assignment />,
      color: "#2b6cb0"
    },
    {
      title: "Completed",
      value: stats.doneTasks,
      detail: `${completionRate}% completion rate`,
      icon: <CheckCircleRounded />,
      color: "#2f855a"
    }
  ]

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 420 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 7,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(31,77,71,0.96) 0%, rgba(25,54,49,0.98) 56%, rgba(198,124,78,0.92) 100%)",
          color: "white",
          position: "relative"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.2), transparent 24%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.12), transparent 18%)"
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
          sx={{ position: "relative" }}
        >
          <Box sx={{ maxWidth: 640 }}>
            <Chip
              label="Operational snapshot"
              sx={{
                mb: 2,
                bgcolor: "rgba(255,255,255,0.16)",
                color: "white"
              }}
            />
            <Typography variant="h4" sx={{ maxWidth: 620 }}>
              Delivery looks clearer when your numbers have room to breathe.
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 620, color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>
              This dashboard now highlights momentum, completion rate, and workload distribution in a more polished command view.
            </Typography>
          </Box>

          <Paper
            sx={{
              minWidth: { xs: "100%", md: 280 },
              minHeight: 156,
              p: 3,
              borderRadius: 6,
              bgcolor: "rgba(255,255,255,0.12)",
              color: "white",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)"
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.16)", width: 44, height: 44 }}>
                  <TrendingUpRounded />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
                    Completion rate
                  </Typography>
                  <Typography variant="h5">{completionRate}%</Typography>
                </Box>
              </Stack>
              <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.6 }}>
                {stats.doneTasks} tasks are done, with {stats.inProgressTasks} actively moving and {stats.pendingTasks} still open.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }
        }}
      >
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ height: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 96 }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: card.color }}>
                    {card.value}
                  </Typography>
                  <Typography sx={{ mt: 0.75, color: "text.secondary" }}>
                    {card.detail}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(card.color, 0.12),
                    color: card.color,
                    width: 46,
                    height: 46
                  }}
                >
                  {card.icon}
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Grid>
        <Paper sx={{ p: 3.5, borderRadius: 6 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
            <Box>
              <Typography variant="h6">Volume overview</Typography>
              <Typography color="text.secondary">
                Compare the overall size of your portfolio, release stream, and task load.
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
              <RadarRounded />
            </Avatar>
          </Stack>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "rgba(31, 77, 71, 0.06)" }}
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(31, 77, 71, 0.08)",
                  boxShadow: "0 18px 32px rgba(31, 41, 51, 0.12)"
                }}
              />
              <Bar dataKey="value" fill="#1f4d47" radius={[12, 12, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 3.5, borderRadius: 6 }}>
          <Typography variant="h6">Status balance</Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            See whether execution is finishing strong or piling up in the middle.
          </Typography>

          {stats.tasks > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(31, 77, 71, 0.08)",
                    boxShadow: "0 18px 32px rgba(31, 41, 51, 0.12)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                display: "grid",
                placeItems: "center",
                minHeight: 280,
                borderRadius: 5,
                borderStyle: "dashed"
              }}
            >
              <Typography color="text.secondary">No tasks yet</Typography>
            </Paper>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {pieData.map((entry, index) => (
              <Chip
                key={entry.name}
                label={`${entry.name}: ${entry.value}`}
                sx={{
                  bgcolor: alpha(chartColors[index], 0.12),
                  color: chartColors[index]
                }}
              />
            ))}
          </Stack>
        </Paper>
      </Grid>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 6, minHeight: 120, display: "flex", alignItems: "center" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha("#c98633", 0.14), color: "#c98633", width: 46, height: 46 }}>
              <PendingActionsRounded />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: "#c98633" }}>
                {stats.pendingTasks}
              </Typography>
              <Typography color="text.secondary">Open tasks waiting for attention</Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 6, minHeight: 120, display: "flex", alignItems: "center" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: alpha("#2b6cb0", 0.14), color: "#2b6cb0", width: 46, height: 46 }}>
              <ScheduleRounded />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: "#2b6cb0" }}>
                {stats.inProgressTasks}
              </Typography>
              <Typography color="text.secondary">Tasks currently in motion</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
