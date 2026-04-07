import { useEffect, useMemo, useState } from "react"
import { alpha } from "@mui/material/styles"
import { api } from "../api"
import { getUser } from "../auth"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Inventory2Rounded,
  NotesRounded,
  NumbersRounded,
  SearchRounded,
  ThumbDownRounded
} from "@mui/icons-material"
import "./Tasks.css"

type Task = {
  id: number
  product?: string | null
  quantity?: number | null
  reason?: string | null
  status: string
  requested_by?: number | null
  requested_by_name?: string | null
  requested_at?: string | null
  manager_comment?: string | null
  reviewed_at?: string | null
}

const statusTone: Record<string, string> = {
  Pending: "#c98633",
  Approved: "#2f855a",
  Rejected: "#c53030"
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "No request time"
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function Tasks() {
  const user = getUser()
  const isManager = user?.role === "Manager"

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [reason, setReason] = useState("")
  const [search, setSearch] = useState("")
  const [rejectingTask, setRejectingTask] = useState<Task | null>(null)
  const [managerComment, setManagerComment] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const tasksRes = await api.get("/tasks", {
        params: {
          user_id: user?.id,
          user_role: user?.role,
          ...(isManager ? { status: "Pending" } : {})
        }
      })
      setTasks(tasksRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!product.trim() || !reason.trim() || Number(quantity) <= 0) return

    try {
      await api.post("/tasks", {
        product,
        quantity: Number(quantity),
        reason,
        user_id: user?.id
      })
      setProduct("")
      setQuantity("1")
      setReason("")
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const approveTask = async (id: number) => {
    try {
      await api.put(`/tasks/${id}`, { action: "approve" })
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const rejectTask = async () => {
    if (!rejectingTask) return
    if (!managerComment.trim()) {
      alert("Comment is required when rejecting a request")
      return
    }

    try {
      await api.put(`/tasks/${rejectingTask.id}`, {
        action: "reject",
        manager_comment: managerComment
      })
      setRejectingTask(null)
      setManagerComment("")
      loadData()
    } catch (err: any) {
      alert(err.response?.data?.message || "Unable to reject request")
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this request?")) return

    try {
      await api.delete(`/tasks/${id}`)
      loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        `${task.product || ""} ${task.reason || ""} ${task.requested_by || ""} ${task.quantity || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [tasks, search]
  )

  const totalPending = tasks.filter((task) => task.status === "Pending").length
  const totalApproved = tasks.filter((task) => task.status === "Approved").length
  const totalRejected = tasks.filter((task) => task.status === "Rejected").length

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
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="overline" color="primary.main">
              Work requests
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              {isManager
                ? "Review only pending worker requests and approve or reject them."
                : "Submit product requests with quantity and reason, then follow the decision."}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2 }}>
              {isManager
                ? "The manager task page now shows only pending requests, including the worker user ID who raised them."
                : "Your page shows only the requests created by you, along with their current approval status."}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Paper sx={{ p: 2.5, minWidth: 150, minHeight: 126, borderRadius: 5, display: "grid", alignContent: "start" }}>
              <Typography color="text.secondary" fontWeight={700}>
                Pending
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, color: "#c98633" }}>
                {totalPending}
              </Typography>
            </Paper>
            {!isManager && (
              <>
                <Paper sx={{ p: 2.5, minWidth: 150, minHeight: 126, borderRadius: 5, display: "grid", alignContent: "start" }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    Approved
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: "#2f855a" }}>
                    {totalApproved}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2.5, minWidth: 150, minHeight: 126, borderRadius: 5, display: "grid", alignContent: "start" }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    Rejected
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: "#c53030" }}>
                    {totalRejected}
                  </Typography>
                </Paper>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", xl: "380px minmax(0, 1fr)" }
        }}
      >
        {!isManager && (
          <Paper sx={{ p: 3, borderRadius: 6, minHeight: 340 }}>
            <Typography variant="h6">Submit request</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
              Send the product name, quantity, and reason for approval.
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Product"
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory2Rounded color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersRounded color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesRounded color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                disabled={!product.trim() || !reason.trim() || Number(quantity) <= 0}
                onClick={addTask}
              >
                Submit request
              </Button>
            </Stack>
          </Paper>
        )}

        <Stack spacing={3} sx={{ gridColumn: isManager ? "1 / -1" : undefined }}>
          <Paper sx={{ p: 2.5, borderRadius: 6, minHeight: 102, display: "flex", alignItems: "center" }}>
            <TextField
              placeholder={isManager ? "Search by product, quantity, reason, or user ID" : "Search your requests"}
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
              <Avatar sx={{ mx: "auto", mb: 2, width: 60, height: 60, bgcolor: alpha("#1f4d47", 0.1), color: "primary.main" }}>
                <Inventory2Rounded />
              </Avatar>
              <Typography variant="h6">No requests found</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {isManager
                  ? "No pending worker requests match the current search."
                  : "You have not submitted any requests yet."}
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
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha(tone, 0.12), color: tone, width: 42, height: 42 }}>
                              <Inventory2Rounded />
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                                {task.product || "Unnamed product"}
                              </Typography>
                              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                                {task.reason || "No reason provided"}
                              </Typography>
                              <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {task.quantity || 1}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Requested on: {formatDateTime(task.requested_at)}
                                </Typography>
                                {isManager && (
                                  <Typography variant="body2" color="text.secondary">
                                    Requested by user ID: {task.requested_by ?? "Unknown"}
                                  </Typography>
                                )}
                                {!isManager && task.status === "Rejected" && task.manager_comment && (
                                  <Typography variant="body2" color="error.main">
                                    Rejection comment: {task.manager_comment}
                                  </Typography>
                                )}
                              </Stack>
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
                          <Chip label={task.status} sx={{ bgcolor: alpha(tone, 0.12), color: tone }} />
                          {isManager && (
                            <>
                              <Button
                                color="success"
                                variant="outlined"
                                startIcon={<CheckCircleRounded />}
                                onClick={() => approveTask(task.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                color="error"
                                variant="text"
                                startIcon={<ThumbDownRounded />}
                                onClick={() => {
                                  setRejectingTask(task)
                                  setManagerComment("")
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {!isManager && (
                            <Button
                              color="error"
                              variant="text"
                              startIcon={<DeleteOutlineRounded />}
                              onClick={() => deleteTask(task.id)}
                            >
                              Delete
                            </Button>
                          )}
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

      <Dialog open={Boolean(rejectingTask)} onClose={() => setRejectingTask(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject request</DialogTitle>
        <DialogContent>
          <TextField
            label="Manager comment"
            value={managerComment}
            onChange={(event) => setManagerComment(event.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 1 }}
            helperText="Comment is required only when rejecting a request."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setRejectingTask(null)} color="inherit">
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={rejectTask}>
            Reject request
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
