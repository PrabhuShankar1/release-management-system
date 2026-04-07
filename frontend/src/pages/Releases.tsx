import { useEffect, useMemo, useState } from "react"
import { api } from "../api"
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material"

type ApprovedRequest = {
  id: number
  reviewed_at?: string | null
}

type MonthColumn = {
  key: string
  count: number
  title: string
}

type MonthBlock = {
  label: string
  columns: MonthColumn[][]
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const toDayKey = (date: Date) => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export default function Releases() {
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([])
  const [loading, setLoading] = useState(true)

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

  const { months, maxCount, currentYear } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()

    const counts = approvedRequests.reduce<Record<string, number>>((acc, request) => {
      if (!request.reviewed_at) return acc
      const date = new Date(request.reviewed_at)
      if (date.getFullYear() !== year) return acc
      const key = toDayKey(date)
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const monthBlocks: MonthBlock[] = monthLabels.map((label, monthIndex) => {
      const monthStart = new Date(year, monthIndex, 1)
      const monthEnd = new Date(year, monthIndex + 1, 0)
      const leadingDays = monthStart.getDay()
      const totalCells = leadingDays + monthEnd.getDate()
      const totalColumns = Math.ceil(totalCells / 7)
      const columns: MonthColumn[][] = []

      for (let columnIndex = 0; columnIndex < totalColumns; columnIndex += 1) {
        const column: MonthColumn[] = []

        for (let rowIndex = 0; rowIndex < 7; rowIndex += 1) {
          const dayNumber = columnIndex * 7 + rowIndex - leadingDays + 1

          if (dayNumber < 1 || dayNumber > monthEnd.getDate()) {
            column.push({
              key: `${label}-${columnIndex}-${rowIndex}`,
              count: -1,
              title: ""
            })
            continue
          }

          const current = new Date(year, monthIndex, dayNumber)
          const key = toDayKey(current)
          const count = counts[key] || 0

          column.push({
            key,
            count,
            title: `${current.toDateString()}: ${count} approved`
          })
        }

        columns.push(column)
      }

      return { label, columns }
    })

    const highestCount = Math.max(
      0,
      ...monthBlocks.flatMap((month) => month.columns.flat().map((cell) => Math.max(cell.count, 0)))
    )

    return {
      months: monthBlocks,
      maxCount: highestCount,
      currentYear: year
    }
  }, [approvedRequests])

  const getHeatColor = (count: number) => {
    if (count < 0) return "transparent"
    if (count === 0) return "#2d333b"
    if (maxCount <= 1) return "#3fb950"
    const intensity = count / maxCount
    if (intensity < 0.34) return "#2ea043"
    if (intensity < 0.67) return "#26a641"
    return "#39d353"
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
        <Typography variant="overline" color="secondary.main">
          Daily progress
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>
          Monthly approval heatmap
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.2, maxWidth: 760 }}>
          Approval activity for {currentYear}, arranged month by month from Jan to Dec with weekday labels and clear gaps between months.
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          sx={{
            p: 3,
            borderRadius: 6,
            bgcolor: "#161b22",
            color: "#c9d1d9",
            overflowX: "auto",
            overflowY: "hidden"
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ minWidth: 1220 }}>
              <Box sx={{ display: "flex", gap: 3.5, ml: "52px", mb: 1.5, alignItems: "flex-end" }}>
                {months.map((month) => (
                  <Box key={month.label} sx={{ width: `${month.columns.length * 20}px` }}>
                    <Typography variant="body2" sx={{ color: "#c9d1d9", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {month.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Stack spacing="6px" sx={{ pt: 0.25 }}>
                  {dayLabels.map((day) => (
                    <Box key={day} sx={{ height: 14, display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ color: "#8b949e", fontSize: "0.72rem" }}>
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ display: "flex", gap: 3.5 }}>
                  {months.map((month) => (
                    <Box key={month.label} sx={{ display: "flex", gap: "6px" }}>
                      {month.columns.map((column, columnIndex) => (
                        <Stack key={`${month.label}-${columnIndex}`} spacing="6px">
                          {column.map((cell) => (
                            <Box
                              key={cell.key}
                              title={cell.title}
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: "3px",
                                bgcolor: getHeatColor(cell.count),
                                border: cell.count >= 0 ? "1px solid rgba(255,255,255,0.04)" : "none"
                              }}
                            />
                          ))}
                        </Stack>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#8b949e" }}>
                Less
              </Typography>
              {[0, 1, 2, 3].map((level) => (
                <Box
                  key={level}
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "3px",
                    bgcolor: getHeatColor(level === 0 ? 0 : Math.max(1, Math.ceil((maxCount || 1) * (level / 3))))
                  }}
                />
              ))}
              <Typography variant="body2" sx={{ color: "#8b949e" }}>
                More
              </Typography>
              <Typography variant="body2" sx={{ color: "#8b949e", ml: 2 }}>
                Total approvals: {approvedRequests.length}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}
