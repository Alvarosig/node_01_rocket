import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/buid-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const tasks = database.select("tasks")

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      }

      database.insert("tasks", task)

      return res.writeHead(201).end("Task created")
    },
  },
  {
    //FIX: created_at doesn't show up in the body after update
    method: "PUT",
    path: buildRoutePath("/task/:taskId"),
    handler: (req, res) => {
      const { taskId } = req.params
      const { title, description, created_at } = req.body

      console.log(req.body)

      database.update("tasks", taskId, {
        title,
        description,
        created_at: created_at,
        updated_at: new Date(),
        completed_at: null,
      })

      return res.writeHead(204).end()
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/task/:taskId"),
    handler: (req, res) => {
      const { taskId } = req.params

      database.delete("tasks", taskId)

      return res.writeHead(204).end()
    },
  },
]
