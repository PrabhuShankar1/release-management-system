import { useEffect, useState } from "react"
import { api } from "../api"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

export default function Dashboard() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const [p, r, t] = await Promise.all([
      api.get("/projects"),
      api.get("/releases"),
      api.get("/tasks")
    ])

    setData([
      { name: "Projects", value: p.data.length },
      { name: "Releases", value: r.data.length },
      { name: "Tasks", value: t.data.length }
    ])
  }

  return (
    <>
      <h2>Dashboard</h2>

      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </>
  )
}