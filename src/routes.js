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

      if(!title?.trim() || !description?.trim()) {
        return res.writeHead(400).end("Title and description are required")
      }

      const task = {
        id: randomUUID(),
        title: title,
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
    method: "PUT",
    path: buildRoutePath("/task/:taskId"),
    handler: (req, res) => {
      const { taskId } = req.params
      const { title, description } = req.body

      const taskToUpdate =  database.select("tasks").find(task => task.id === taskId)

      if(!taskToUpdate) {
        return res.writeHead(400).end("Task ID not found")
      }
      
      if(!title?.trim() || !description?.trim()) {
        return res.writeHead(400).end("Title and description are required")
      }

      database.update("tasks", taskId, {
        title: title || taskToUpdate.title,
        description: description || taskToUpdate.description,
        created_at: taskToUpdate.created_at,
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
  {
    method: "PATCH",
    path: buildRoutePath("/task/:taskId/complete"),
    handler: (req, res) => {
      const { taskId } = req.params

      const taskToUpdate =  database.select("tasks").find(task => task.id === taskId)

      database.update("tasks", taskId, {
        ...taskToUpdate,
        completed_at: new Date(),
      })

      return res.writeHead(204).end()
    },
  },
]
