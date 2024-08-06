import { parse } from 'csv-parse'
import fs from "node:fs"

const csvPath = "csv/tasks.csv"
const baseUrl = "http://localhost:3001/task"

const csvStream = fs.createReadStream(csvPath)

const parser = parse({ delimiter: ",", from_line: 2 })

const processData = async (payload) => {
  const temp = {
    title: payload[0],
    description: payload[1],
  }

  try {
    fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(temp),
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.log(error)
  }
}

csvStream.pipe(parser)
  .on("data", (data) => {
    processData(data)
  })
  .on("end", async () => {
    console.log("CSV file successfully processed")
  })