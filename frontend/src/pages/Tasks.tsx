import { useEffect, useState } from "react"
import axios from "axios"
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
}

const API_TASKS = "http://127.0.0.1:5000/api/tasks"
const API_RELEASES = "http://127.0.0.1:5000/api/releases"

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [releases, setReleases] = useState<Release[]>([])

  const [title, setTitle] = useState("")
  const [releaseId, setReleaseId] = useState<number | "">("")

  const loadData = async () => {
    const [t, r] = await Promise.all([
      axios.get(API_TASKS),
      axios.get(API_RELEASES)
    ])
    setTasks(t.data)
    setReleases(r.data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const addTask = async () => {
    if (!title || !releaseId) return alert("Fill all fields")
    await axios.post(API_TASKS, { title, release_id: releaseId })
    setTitle("")
    setReleaseId("")
    loadData()
  }

  const markDone = async (id: number) => {
    await axios.put(`${API_TASKS}/${id}`, { status: "Done" })
    loadData()
  }

  const deleteTask = async (id: number) => {
    await axios.delete(`${API_TASKS}/${id}`)
    loadData()
  }

  const getReleaseName = (id: number) => {
    const r = releases.find(x => x.id === id)
    return r?.name ?? "Unknown"
  }

  return (
    <div className="tasks-container">
      <h1>📋 Tasks</h1>

      <div className="form-section">
        <input
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select
          value={releaseId}
          onChange={e => setReleaseId(Number(e.target.value))}
        >
          <option value="">Select Release</option>
          {releases.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {tasks.map(t => (
        <div key={t.id} className="task-card">
          <div>
            <b>{t.title}</b>
            <p>Release: {getReleaseName(t.release_id)}</p>
            <p>Status: {t.status}</p>
          </div>
          <div>
            <button onClick={() => markDone(t.id)}>Done</button>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tasks