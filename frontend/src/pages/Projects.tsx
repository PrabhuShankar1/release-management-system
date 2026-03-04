import { useEffect, useState } from "react"
import axios from "axios"
import "./Projects.css"
type Project = {
  id: number
  name: string
  description: string
}

const API = "http://127.0.0.1:5000/api/projects"

function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // =========================
  // Load all projects
  // =========================
  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API)
      setProjects(res.data)
    } catch (err) {
      console.error(err)
      alert("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // =========================
  // Add project
  // =========================
  const addProject = async () => {
    if (!name.trim()) return alert("Project name required")

    try {
      await axios.post(API, { name, description })

      setName("")
      setDescription("")
      loadProjects()
    } catch (err) {
      console.error(err)
      alert("Failed to add project")
    }
  }

  // =========================
  // Delete project
  // =========================
  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return

    try {
      await axios.delete(`${API}/${id}`)
      loadProjects()
    } catch (err) {
      console.error(err)
      alert("Failed to delete project")
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="app">

      <h1 className="title">📂 Projects</h1>

      {/* ===== Form ===== */}
      <div className="form">

        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input
            id="name"
            placeholder="Enter project name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <input
            id="desc"
            placeholder="Enter description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button className="button" onClick={addProject}>
          Add Project
        </button>
      </div>

      {/* ===== List ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="project-list">
          {projects.map(p => (
            <div key={p.id} className="project-card">
              <div>
                <b>{p.name}</b>
                <p>{p.description}</p>
              </div>

              <button
                className="btn delete-btn"
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Projects
