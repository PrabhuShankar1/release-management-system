import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/projects">Projects</Link>
      <Link to="/releases">Releases</Link>
      <Link to="/tasks">Tasks</Link>
    </nav>
  )
}