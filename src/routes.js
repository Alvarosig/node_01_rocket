import { randomUUID } from 'node:crypto'

export const routes = [
  {
    method: 'GET',
    path: '/task',
    handler: (req, res, tasks) => {
      console.log(tasks)
      return res.writeHead(200).end('Hello World')
    }
  },
  {
    method: 'POST',
    path: '/task',
    handler: (req, res, tasks) => {
      const { title, description } = req.body
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      tasks.push(task)

      return res.writeHead(201).end('Task created')
    }
  }
]