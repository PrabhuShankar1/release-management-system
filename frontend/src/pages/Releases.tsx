import { useEffect, useState } from "react"
import { api } from "../api"
import {
  Button, TextField, Table, TableHead, TableRow,
  TableCell, TableBody
} from "@mui/material"
import "./Releases.css"

export default function Releases() {
  const [rows, setRows] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)

  useEffect(() => { load() }, [])

  const load = async () => {
    const r = await api.get("/releases")
    setRows(r.data)
  }

  const remove = async (id: number) => {
    await api.delete(`/releases/${id}`)
    load()
  }

  const filtered = rows
    .filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
    .slice(page * 5, page * 5 + 5)

  return (
    <>
      <h2>Releases</h2>

      <TextField
        label="Search"
        onChange={e => setSearch(e.target.value)}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filtered.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.version}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => setPage(p => Math.max(p - 1, 0))}>Prev</Button>
      <Button onClick={() => setPage(p => p + 1)}>Next</Button>
    </>
  )
}