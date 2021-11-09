const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const db = JSON.parse(fs.readFileSync(__dirname+'/db.json', 'utf-8'))
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routing
app.get('/api/musics', (_req, res) => {
  res.status(200).send(db.musics)
})

// error handler
app.use('/', (_req, res) => {
  res.status(404)
    .send({
      error: 1,
      msg: 'not found.'
    })
})

app.listen(port, () => console.log(`server started at http://localhost:${port}`))