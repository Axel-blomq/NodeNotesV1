const express = require('express')
const cors = require('cors')

const checkName = require('./middleware/check-name')
require('dotenv').config()

const PORT = process.env.PORT || 8080

const app = express()
app.use(cors())

app.get('/', (req, res) => { 
    console.log(req.myVar)
    res.send("<h1>Hello!! this works?!?</h1>")
})

// Behövs för att vi ska kunna ta emot JSON i request bodyn:
app.use(express.json())

const notesRouter = require('./routes/notes')
app.use('/notes', notesRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)


const boardRouter = require('./routes/board')
app.use('/board', boardRouter)


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
